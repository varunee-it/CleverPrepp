// Study Session Status Lifecycle constants
export const STATUS_IDLE = "idle";
export const STATUS_CREATED = "created";
export const STATUS_RUNNING = "running";
export const STATUS_PAUSED = "paused";
export const STATUS_FINALIZING = "finalizing";
export const STATUS_COMPLETED = "completed";
export const STATUS_CANCELLED = "cancelled";

// Sync Lifecycle constants
export const SYNC_LOCAL_ONLY = "local_only";
export const SYNC_SYNCING = "syncing";
export const SYNC_SYNCED = "synced";
export const SYNC_PENDING = "sync_pending";

// Reusable Activity types
export const ACTIVITY_PDF = "reading_pdf";
export const ACTIVITY_NOTES = "viewing_notes";

/**
 * Centralized presentation helper.
 * Maps the entire session state to user-friendly UX labels.
 */
export const getSessionDisplayState = (session) => {
  const defaultState = { title: "Ready to Focus", subtitle: "Configure your next study session." };
  if (!session) return defaultState;

  switch(session.status) {
    case STATUS_IDLE: 
      return defaultState;
    case STATUS_CREATED: 
      return { title: "Ready to Begin", subtitle: "Press Begin Session whenever you're ready." };
    case STATUS_RUNNING: 
      return { title: "Active Session", subtitle: "Your focus session is currently in progress." };
    case STATUS_PAUSED: 
      return { title: "Session Paused", subtitle: "Resume whenever you're ready." };
    case STATUS_FINALIZING:
      return { title: "Saving Session...", subtitle: "Syncing your progress securely to the cloud." };
    case STATUS_COMPLETED: 
      return session.completionReason === 'natural' 
        ? { title: "Goal Achieved 🎯", subtitle: "Congratulations! You completed your planned focus session." }
        : { title: "Session Ended", subtitle: "Your progress has been saved. Start another session whenever you're ready." };
    case STATUS_CANCELLED: 
      return { title: "Session Cancelled", subtitle: "This session was cancelled before completion." };
    default: 
      return defaultState;
  }
};
export const ACTIVITY_FLASHCARDS = "reviewing_flashcards";
export const ACTIVITY_QUIZ = "taking_quiz";
export const ACTIVITY_PODCAST = "listening_podcast";
export const ACTIVITY_QUICK = "study_session";

// Launch sources tracking
export const SOURCE_DASHBOARD = "dashboard";
export const SOURCE_DOCUMENT = "document";
export const SOURCE_HEADER = "header";

// Static ambient sounds configuration registry
export const AMBIENT_SOUNDS = [
  // Focus Ambience
  { id: "rain", title: "Rainy Window", category: "Focus Ambience", icon: "🌧️", subtitle: "Gentle rain tapping on glass", moods: ["Deep Focus", "Relax"], filePath: "/audio/rain.mp3", loop: true, enabled: true },
  { id: "forest-birds", title: "Forest Retreat", category: "Focus Ambience", icon: "🌲", subtitle: "Rustling leaves and birds", moods: ["Creative", "Relax"], filePath: "/audio/forest.mp3", loop: true, enabled: true },
  { id: "ocean-waves", title: "Ocean Breeze", category: "Focus Ambience", icon: "🌊", subtitle: "Rhythmic tides on sandy shore", moods: ["Relax", "Reading"], filePath: "/audio/ocean-waves.mp3", loop: true, enabled: true },
  { id: "night-train", title: "Midnight Express", category: "Focus Ambience", icon: "🚂", subtitle: "Distant metallic hum of a night train", moods: ["Deep Focus", "Relax"], filePath: "/audio/night-train.mp3", loop: true, enabled: true },
  { id: "fireplace", title: "Cozy Fireplace", category: "Focus Ambience", icon: "🔥", subtitle: "Warm wood crackles and glow", moods: ["Relax", "Creative"], filePath: "/audio/fireplace.mp3", loop: true, enabled: true },
  { id: "instrumental-lofi", title: "Piano Dreams", category: "Focus Ambience", icon: "🎵", subtitle: "Calm chord progressions and keys", moods: ["Creative", "Reading"], filePath: "/audio/instrumental-lofi.mp3", loop: true, enabled: true },
  { id: "lofi-beats", title: "Lo-fi Beats", category: "Focus Ambience", icon: "🎧", subtitle: "Relaxed study beat rhythms", moods: ["Creative", "Reading"], filePath: "/audio/lofi.mp3", loop: true, enabled: true }
];
