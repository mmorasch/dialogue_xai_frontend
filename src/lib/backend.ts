import { PUBLIC_BACKEND_URL } from '$env/static/public';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import * as firebaseConfig from '../../data/config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default {
    xai: (user_id: string, study_group = 'A', user_prediction='None') => ({
        init: () => fetch(`${PUBLIC_BACKEND_URL}init?user_id=${user_id}&study_group=${study_group}`),
        get_user_correctness: () => fetch(`${PUBLIC_BACKEND_URL}get_user_correctness?user_id=${user_id}`),
        finish: () => fetch(PUBLIC_BACKEND_URL + "finish" + "?user_id=" + user_id, {method: 'DELETE',}),
        get_train_datapoint: () => fetch(PUBLIC_BACKEND_URL + "get_train_datapoint" + "?user_id=" + user_id),
        get_test_datapoint: () => fetch(PUBLIC_BACKEND_URL + "get_test_datapoint" + "?user_id=" + user_id),
        get_testing_questions: () => fetch(PUBLIC_BACKEND_URL + "get_testing_questions" + "?user_id=" + user_id),
        get_response: (question: number, feature: number) => fetch(PUBLIC_BACKEND_URL + "get_response" + "?user_id=" + user_id, {
            method: "POST",
            body: JSON.stringify({question, feature})
        }),
    }),
    firebase: (user_id: string) => ({
        // TODO: Change all Functions to include user_id and correct the feedback things to be tied to question
        authenticateUser: () => authenticateUser(),
        logCompleted: (userId: string) => logCompleted(userId),
    }),
}

// INTRO LOGGING

export function setupUserProfile(userId: string,
                                 profileData: object) {
    const db = getDatabase(app);
    const profileRef = ref(db, `users/${userId}/profile`);
    set(profileRef, profileData);

    // Set completed to false in the beginning of the experiment
    const completedRef = ref(db, `users/${userId}/completed`);
    set(completedRef, false);
}

export async function assignStudyGroup() {
    const db = getDatabase(app);
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
        const users = snapshot.val();
        let groupStaticCount = 0;
        let groupInteractiveCount = 0;
        for (const userId in users) {
            try {
                const user = users[userId];
                if (user["profile"]["study_group"] === 'static') {
                    groupStaticCount++;
                } else if (user["profile"]["study_group"] === 'interactive') {
                    groupInteractiveCount++;
                }
            } catch (error) {
                console.info(`Error accessing study_group property for user ${userId}:`, error);
            }
        }

        return groupStaticCount <= groupInteractiveCount ? 'static' : 'interactive';
    } else {

        return 'static';
    }
}

// EXPERIMENT LOGGING
export function logEvent(userId: string,
                         source: string,
                         action: string,
                         datapointCount: number,
                         additionalData = {}) {
    const db = getDatabase(app);
    let timestamp = new Date().toISOString();
    timestamp = timestamp.split('.')[0]; // remove milliseconds
    const logRef = ref(db, `users/${userId}/logs/train_datapoint_${datapointCount}/${action}_${timestamp}`);
    const logEntry = {
        source: source,
        action: action,
        data: additionalData
    };
    set(logRef, logEntry);
}

export function logTestingResponse(userId: string,
                                   datapointCount: number,
                                   test_response: string,
                                   final = false,
                                   true_label = "") {
    const db = getDatabase(app);
    let timestamp = new Date().toISOString();
    timestamp = timestamp.split('.')[0];
    if (final) {
        const logRef = ref(db, `users/${userId}/logs/test_datapoint_${datapointCount}/final_response_${timestamp}`);
    } else {
        const logRef = ref(db, `users/${userId}/logs/test_datapoint_${datapointCount}/response_${timestamp}`);
    }
    const logRef = ref(db, `users/${userId}/logs/test_datapoint_${datapointCount}`);
    const logEntry = {
        response: test_response,
        timestamp: timestamp,
        true_label: true_label,
    };
    set(logRef, logEntry);
    fetch(`${PUBLIC_BACKEND_URL}set_user_prediction?user_id=${userId}&user_prediction=${test_response}`, {method: 'POST'});
}


// FINAL LOGGING
export function saveQuestionnaireAnswers(userId: string,
                                         questions: string[],
                                         answers: number[],
                                         questionnaire_name = "final_questionnaire") {
    // Saves user final questionnaire answers to firebase
    const db = getDatabase(app);
    const answersRef = ref(db, `users/${userId}/${questionnaire_name}`);
    set(answersRef, {questions: questions, answers: answers});
}


export function logFinalFeedback(userId: string, feedback: string) {
    const db = getDatabase(app);
    const feedbackRef = ref(db, `users/${userId}/final_feedback`);

    const feedbackData = {
        feedback: feedback,
        timestamp: new Date().toISOString(),
    };

    set(feedbackRef, feedbackData);
    logCompleted(userId);
}


export function logCompleted(userId: string) {
    const db = getDatabase(app);
    const completed_ref = ref(db, `users/${userId}/completed`);
    set(completed_ref, true);
}

