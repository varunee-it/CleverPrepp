import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup environment variables properly before importing models
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';

const isDryRun = process.argv.includes('--dry-run');
const isApply = process.argv.includes('--apply');

if (!isDryRun && !isApply) {
  console.log("Please specify either --dry-run or --apply");
  process.exit(1);
}

const migrateStreaks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Migration] Connected to database in ${isDryRun ? 'DRY-RUN' : 'APPLY'} mode.`);

    // We use .lean() to get raw documents and see what's actually at the root level in the DB
    const users = await User.find({}).lean();
    let migratedCount = 0;
    let skippedCount = 0;

    for (const rawUser of users) {
      const email = rawUser.email || 'Unknown';
      const oldCurrentStreak = rawUser.currentStreak !== undefined ? rawUser.currentStreak : 0;
      const oldLongestStreak = rawUser.longestStreak !== undefined ? rawUser.longestStreak : 0;
      const oldLastStudyDate = rawUser.lastStudyDate || null;
      const oldTotalStudyDays = rawUser.totalStudyDays !== undefined ? rawUser.totalStudyDays : 0;

      // Check if studyStats exists and is properly populated
      const hasStudyStats = rawUser.studyStats !== undefined;
      const studyStatsCurrent = hasStudyStats && rawUser.studyStats.currentStreak !== undefined ? rawUser.studyStats.currentStreak : 0;
      const studyStatsTotal = hasStudyStats && rawUser.studyStats.totalStudyDays !== undefined ? rawUser.studyStats.totalStudyDays : 0;

      // If we already have studyStats populated, we just need to verify if legacy fields exist to unset them.
      const hasLegacyFields = rawUser.currentStreak !== undefined || rawUser.longestStreak !== undefined || rawUser.lastStudyDate !== undefined || rawUser.totalStudyDays !== undefined;
      
      const needsMigration = (!hasStudyStats && (oldCurrentStreak > 0 || oldTotalStudyDays > 0)) ||
                             (rawUser.currentStreak !== undefined && studyStatsCurrent === 0 && oldCurrentStreak > 0) || 
                             (rawUser.totalStudyDays !== undefined && studyStatsTotal === 0 && oldTotalStudyDays > 0);

      const needsCleanup = hasStudyStats && hasLegacyFields && !needsMigration;

      if (!needsMigration && !needsCleanup) {
        skippedCount++;
        continue;
      }

      if (isDryRun) {
        console.log(`[Migration] Email: ${email} | Old currentStreak: ${oldCurrentStreak} | New currentStreak: ${oldCurrentStreak} | Status: PLANNED (DRY-RUN)`);
        migratedCount++;
      } else if (isApply) {
        const updateDoc = {
          $set: {
            "studyStats.currentStreak": oldCurrentStreak,
            "studyStats.longestStreak": oldLongestStreak,
            "studyStats.lastStreakDate": oldLastStudyDate,
            "studyStats.totalStudyDays": oldTotalStudyDays
          },
          $unset: {
            currentStreak: "",
            longestStreak: "",
            lastStudyDate: "",
            totalStudyDays: ""
          }
        };
        
        await User.updateOne({ _id: rawUser._id }, updateDoc, { strict: false });
        console.log(`[Migration] Email: ${email} | Old currentStreak: ${oldCurrentStreak} | New currentStreak: ${oldCurrentStreak} | Status: SUCCESS`);
        migratedCount++;
      }
    }

    console.log(`\n[Migration] Completed. Processed: ${users.length}. Migrated: ${migratedCount}. Skipped: ${skippedCount}.`);
  } catch (error) {
    console.error("[Migration] Fatal Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

migrateStreaks();
