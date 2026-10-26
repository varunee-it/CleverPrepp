import Flashcard from "../models/Flashcard.js";
import { recordStudyActivity } from '../services/studyProgressService.js';

export const getFlashcards = async (req, res, next) => {
    try{
        const flashcards=await Flashcard.find({
            userId:req.user._id,
            documentId:req.params.documentId
        })
        .populate('documentId', 'title fileName')
        .sort({createdAt:-1});

        res.status(200).json({
            success:true,
            count:flashcards.length,
            data:flashcards

        });
    }catch (error){
        next(error);
    }
};

export const getFlashcardSets= async (req, res,next) => {
    try{
        const flashcardSets=await Flashcard.find({
            userId:req.user._id
        })
        .populate('documentId', 'title ')
        .sort({createdAt:-1
        });

        res.status(200).json({
            success:true,
            count:flashcardSets.length,
            data:flashcardSets
        });
    }catch (error){
        next(error);
    }
    
};

export const reviewFlashcard = async (req, res) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id
        });

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                message: "Flashcard not found",
            });
        }

        const card = flashcardSet.cards.id(req.params.cardId);
        if (!card) {
            return res.status(404).json({
                success: false,
                message: "Flashcard not found",
            });
        }

        card.reviewCount = (card.reviewCount || 0) + 1;
        card.lastReviewed = new Date();

        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: flashcardSet,
        });
    } catch (error) {
        console.error("Review Flashcard Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to review flashcard",
        });
    }
};

export const toggleStar = async (req, res) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id
        });

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                message: "Flashcard not found",
            });
        }

        const card = flashcardSet.cards.id(req.params.cardId);
        if (!card) {
            return res.status(404).json({
                success: false,
                message: "Flashcard not found",
            });
        }

        card.isStarred = !card.isStarred;

        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: flashcardSet,
        });
    } catch (error) {
        console.error("Toggle Star Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update star status",
        });
    }
};

export const deleteFlashcardSet= async(req,res,next)=>{
   try{
    const flashcardSet=await Flashcard.findOne({
        _id:req.params.flashcardId,
        userId:req.user._id
    }   );
    if(!flashcardSet){
        return res.status(404).json({
            success:false,
            error:'Flashcard not found',
            statusCode:404
        });

    }
    await flashcardSet.deleteOne();
    res.status(200).json({
        success:true,
        data:flashcardSet,
        message:`Flashcards deleted`
    });
        
    }catch (error){
        next(error);
    }
};

export const saveSessionAnalytics = async (req, res, next) => {
    try {
        const { flashcardId } = req.params;
        const { 
            studyDuration, 
            cardsReviewed, 
            cardsBookmarked, 
            againCount, 
            goodCount, 
            easyCount, 
            avgResponseTime 
        } = req.body;

        const flashcardSet = await Flashcard.findOne({
            _id: flashcardId,
            userId: req.user._id
        });

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: 'Flashcard set not found',
                statusCode: 404
            });
        }

        flashcardSet.analytics = flashcardSet.analytics || [];
        flashcardSet.analytics.push({
            studyDuration: Number(studyDuration || 0),
            cardsReviewed: Number(cardsReviewed || 0),
            cardsBookmarked: Number(cardsBookmarked || 0),
            againCount: Number(againCount || 0),
            goodCount: Number(goodCount || 0),
            easyCount: Number(easyCount || 0),
            avgResponseTime: Number(avgResponseTime || 0),
            completedAt: new Date()
        });

        await flashcardSet.save();

        res.status(200).json({
            success: true,
            message: "Analytics saved successfully",
            data: flashcardSet
        });

        // Record activity (fire and forget)
        // Convert studyDuration (which is usually seconds or milliseconds) to minutes
        // Assuming studyDuration is in seconds based on typical frontend logic
        const durationMinutes = Math.round(Number(studyDuration || 0) / 60) || 1;
        recordStudyActivity(
            req.user._id,
            'flashcard_review',
            durationMinutes,
            { cardsReviewed: Number(cardsReviewed || 0) },
            flashcardSet.documentId,
            `flashcard_${flashcardSet._id.toString()}_${Date.now()}`
        ).catch(err => console.error("[StudyProgress] Failed to record flashcard review:", err));
        
    } catch (error) {
        next(error);
    }
};
