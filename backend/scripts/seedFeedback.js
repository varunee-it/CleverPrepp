import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

// Setup env
dotenv.config();

const indianDemoData = [
  {
    rating: 5,
    title: "Perfect for last-minute revisions",
    review: "I uploaded my DBMS notes before my semester exam and CleverPrep generated concise notes along with quizzes. The Focus Workspace helped me revise consistently without distractions.",
    anonymous: false,
    wouldRecommend: true,
    status: 'approved',
    userStats: { documentsUploaded: 12, quizzesCompleted: 24, flashcardsGenerated: 5 },
    displayName: "Varun Patel",
    course: "Computer Science",
    college: "Nirma University",
    likes: 12,
    helpfulCount: 8,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
  {
    rating: 5,
    title: "Game changer for anatomy!",
    review: "The flashcards made revision much faster than reading PDFs again. I especially liked the AI-generated quizzes, they were surprisingly accurate to what we were taught in class.",
    anonymous: false,
    wouldRecommend: true,
    status: 'approved',
    userStats: { documentsUploaded: 8, quizzesCompleted: 15, flashcardsGenerated: 12 },
    displayName: "Priya Sharma",
    course: "MBBS",
    college: "BJ Medical College",
    likes: 34,
    helpfulCount: 21,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
  },
  {
    rating: 4,
    title: "Great for interview prep",
    review: "I used CleverPrep for Java interview preparation. The analytics helped me identify weak topics. The only thing missing is coding questions, but for theory, it's perfect.",
    anonymous: false,
    wouldRecommend: true,
    status: 'approved',
    userStats: { documentsUploaded: 5, quizzesCompleted: 10, flashcardsGenerated: 2 },
    displayName: "Aarav Mehta",
    course: "Information Technology",
    college: "DA-IICT",
    likes: 8,
    helpfulCount: 5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    rating: 5,
    title: "Saved me during finals week",
    review: "Instead of going through 400 pages of slides, I just uploaded everything and got the summary. I actually slept before my exams this time! Highly recommend to everyone.",
    anonymous: false,
    wouldRecommend: true,
    status: 'approved',
    userStats: { documentsUploaded: 18, quizzesCompleted: 42, flashcardsGenerated: 11 },
    displayName: "Riya Shah",
    course: "B.Tech",
    college: "IIT Bombay",
    likes: 56,
    helpfulCount: 45,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
  },
  {
    rating: 4,
    title: "Very useful for law students",
    review: "Reading dense cases used to take hours. Now I can process the material, get AI summaries, and test my knowledge all in one platform. The spaced repetition is a lifesaver.",
    anonymous: false,
    wouldRecommend: true,
    status: 'approved',
    userStats: { documentsUploaded: 22, quizzesCompleted: 14, flashcardsGenerated: 8 },
    displayName: "Krish Patel",
    course: "LLB",
    college: "MS University",
    likes: 15,
    helpfulCount: 10,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
  },
  {
    rating: 5,
    title: "The focus mode is amazing",
    review: "I have ADHD and the Pomodoro timer in the Focus Workspace is the only thing that keeps me sitting down. The fact that it tracks my streaks is very motivating.",
    anonymous: false,
    wouldRecommend: true,
    status: 'approved',
    userStats: { documentsUploaded: 3, quizzesCompleted: 5, flashcardsGenerated: 1 },
    displayName: "Neha Verma",
    course: "Psychology",
    college: "LD College",
    likes: 42,
    helpfulCount: 38,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    rating: 3,
    title: "Good, but needs more formats",
    review: "It does a great job with PDFs, but I wish I could upload PPTs directly. Once they add that, it will be a 5-star product.",
    anonymous: false,
    wouldRecommend: true,
    status: 'approved',
    userStats: { documentsUploaded: 2, quizzesCompleted: 4, flashcardsGenerated: 0 },
    displayName: "Aditya Joshi",
    course: "Business Administration",
    college: "PDEU",
    likes: 3,
    helpfulCount: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    rating: 5,
    title: "Can't study without it now",
    review: "I've completely replaced my physical flashcards with CleverPrep. The AI is surprisingly good at picking up the nuances of complex engineering topics.",
    anonymous: true,
    wouldRecommend: true,
    status: 'approved',
    userStats: { documentsUploaded: 35, quizzesCompleted: 80, flashcardsGenerated: 40 },
    displayName: "Anonymous Student",
    course: "Mechanical Engineering",
    college: "BITS Pilani",
    likes: 89,
    helpfulCount: 75,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
  }
];

const seedFeedback = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    // We don't have actual user IDs to attach to these demo feedbacks, 
    // so we'll create a dummy user just for the seeding.
    const User = mongoose.model('User');
    let dummyUser = await User.findOne({ email: 'demo@cleverprep.com' });
    
    if (!dummyUser) {
      console.log('Creating dummy user for demo feedback...');
      dummyUser = await User.create({
        name: 'Demo User',
        username: 'demouser',
        email: 'demo@cleverprep.com',
        password: 'password123', // Will be hashed by pre-save
        isEmailVerified: true
      });
    }

    console.log('Clearing existing feedback...');
    await Feedback.deleteMany({});

    console.log('Inserting demo feedback...');
    // In order for unique user index not to fail on multiple seeds, 
    // we technically need distinct user IDs. 
    // Since this is just for demo display, we can bypass the unique user constraint 
    // for this specific manual script by dropping the unique index temporarily 
    // OR we can create multiple dummy users.
    // Let's create multiple dummy users to be safe.
    
    const seededData = [];
    for (let i = 0; i < indianDemoData.length; i++) {
      const data = indianDemoData[i];
      let user = await User.findOne({ email: `demo${i}@cleverprep.com` });
      if (!user) {
        user = await User.create({
          name: data.displayName,
          username: `demo_user_${i}`,
          email: `demo${i}@cleverprep.com`,
          password: 'password123',
          isEmailVerified: true,
          course: data.course,
          college: data.college
        });
      }
      
      data.user = user._id;
      seededData.push(data);
    }

    await Feedback.insertMany(seededData);

    console.log('Feedback seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding feedback:', error);
    process.exit(1);
  }
};

seedFeedback();
