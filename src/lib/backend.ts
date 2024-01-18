import { PUBLIC_BACKEND_URL } from '$env/static/public';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import * as firebaseConfig from '../../data/config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default {
  xai: (user_id: string) => ({
    init: () => fetch(PUBLIC_BACKEND_URL + "init" + "?user_id=" + user_id),
    get_train_datapoint: () => fetch(PUBLIC_BACKEND_URL + "get_train_datapoint" + "?user_id=" + user_id),
    get_test_datapoint: () => fetch(PUBLIC_BACKEND_URL + "get_test_datapoint" + "?user_id=" + user_id),
    get_testing_questions: () => fetch(PUBLIC_BACKEND_URL + "get_testing_questions" + "?user_id=" + user_id),
    get_response: (question: number, feature: number) => fetch(PUBLIC_BACKEND_URL + "get_response" + "?user_id=" + user_id, { method: "POST", body: JSON.stringify({ question, feature }) }),
  }),
  firebase: {
    positive_feedback: () => logFeedback("positive_feedback"),
    negative_feedback: () => logFeedback("negative_feedback"),
    comment: () => console.log("comment"),
    logLikeEvent: (userId: string, datapointCount: number, likeType: string, comment?: string) => logLikeEvent(userId, datapointCount, likeType, comment),
  }
}

function logFeedback(feedback_type: string) {
  const db = getDatabase(app);
  // Create a reference to a specific node based on feedback type
  const feedbackRef = ref(db, feedback_type); // 'positive_feedback' or 'negative_feedback'

  // Create a feedback object
  const feedbackData = {
    timestamp: new Date().toISOString(),
    // Add other data here if needed
  };

  // Push the feedback data to the database
  push(feedbackRef, feedbackData);
}

function logLikeEvent(userId: string,
                      datapointCount: number,
                      likeType: string,
                      comment?: string) {
  const db = getDatabase(app);
  let timestamp = new Date().toISOString();
  timestamp = timestamp.split('.')[0]; // remove milliseconds
  const logRef = ref(db, `users/${userId}/logs/datapoint_${datapointCount}/${timestamp}`);
  const logEntry = {
    likeType: likeType,
    comment: comment || null
  };
  set(logRef, logEntry);
}

export function logEvent(userId: string,
                  source: string,
                  action: string,
                  datapointCount: number,
                  additionalData = {}) {
  const db = getDatabase(app);
  let timestamp = new Date().toISOString();
  timestamp = timestamp.split('.')[0]; // remove milliseconds
  const logRef = ref(db, `users/${userId}/logs/datapoint_${datapointCount}/${timestamp}`);
  const logEntry = {
    source: source,
    action: action,
    data: additionalData
  };
  set(logRef, logEntry);
}

export function saveUserProfile(userId: string,
                                profileData: object) {
  const db = getDatabase(app);
  const profileRef = ref(db, `users/${userId}/profile`);
  set(profileRef, profileData);
}

export function saveUserAnswers(userId: string,
                                answers: number[]) {
  const db = getDatabase(app);
  const answersRef = ref(db, `users/${userId}/answers`);
  set(answersRef, answers);
}


