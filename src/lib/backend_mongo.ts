import {PUBLIC_MONGO_URL, PUBLIC_MONGO_DB_NAME, PUBLIC_BACKEND_URL} from '$env/static/public';
import {Db, MongoClient} from 'mongodb';

const url = PUBLIC_MONGO_URL;
const db_name = PUBLIC_MONGO_DB_NAME;

let db: Db | undefined;
const client = new MongoClient(url);

export function get_timestamp() {
    return new Date().toISOString().split('.')[0];
}

export async function connectToDB() {
    if (db) {
        return db; // Return existing db instance if already connected
    }
    try {
        await client.connect();
        db = client.db(db_name);
        console.log("Connected successfully to MongoDB");

        // Optional: Listen for connection events for monitoring
        client.on('error', err => console.error('Connection error', err));
        client.on('reconnect', () => console.log('Reconnected to MongoDB'));

        return db;
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
        process.exit(1); // Consider a more graceful error handling strategy
    }
}

// Use this function to access db in your application
async function getDB() {
    if (!db) {
        return await connectToDB();
    }
    return db;
}

export default {
    xai: (user_id: string, study_group = 'A') => ({
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
}

// INTRO LOGGING

export async function setupUserProfile(userId: string, profileData: object) {
    try {
        const db = await getDB(); // Use getDB to ensure connection reuse
        const result = await db.collection('users').updateOne(
            {userId},
            {$set: {profileData}},
            {upsert: true}
        );
    } catch (error) {
        console.error("Error setting user profile:", error);
        throw error;
    }
}

export async function assignStudyGroup() {
    console.log("Accessing Mongo");
    try {
        const db = await getDB(); // Ensure connection reuse
        const usersCollection = db.collection('users');

        const groupCounts = await usersCollection.aggregate([
            {$group: {_id: "$profile.study_group", count: {$sum: 1}}}
        ]).toArray();

        let groupStaticCount = 0;
        let groupInteractiveCount = 0;

        // Calculate counts for each study group
        groupCounts.forEach(group => {
            if (group._id === 'static') {
                groupStaticCount = group.count;
            } else if (group._id === 'interactive') {
                groupInteractiveCount = group.count;
            }
        });
        return groupStaticCount <= groupInteractiveCount ? 'static' : 'interactive';
    } catch (error) {
        console.error("Error in assignStudyGroup:", error);
        throw error;
    }
}


// EXPERIMENT LOGGING
export async function logEvent(userId: string, source: string, action: string, datapointCount: number, additionalData = {}, teach_or_testing = "teaching") {
    try {
        const db = await getDB(); // Use getDB for connection reuse
        const logsCollection = db.collection('logs');

        const logEntry = {
            userId,
            source,
            action,
            datapointCount,
            additionalData,
            teach_or_testing,
            timestamp: get_timestamp()
        };

        await logsCollection.insertOne(logEntry);
    } catch (error) {
        console.error("Error logging event:", error);
        throw error; // Rethrow or handle the error appropriately
    }
}


export async function logTestingResponse(userId: string, datapointCount: number, test_response: string, final = false, true_label = "") {
    try {
        const db = await getDB(); // Use getDB for connection reuse
        const testResponsesCollection = db.collection('testResponses');

        const logEntry = {
            userId,
            datapointCount,
            test_response,
            final,
            true_label,
            timestamp: get_timestamp()
        };

        await testResponsesCollection.insertOne(logEntry);
        // Connection is managed for reuse, no need to close here
    } catch (error) {
        console.error("Error logging testing response:", error);
        throw error;
    }
}

// FINAL LOGGING
export async function saveQuestionnaireAnswers(userId: string, questions: string[], answers: number[], questionnaire_name = "final_questionnaire") {
    try {
        const db = await getDB(); // Use getDB for efficient connection reuse
        const questionnaireCollection = db.collection('questionnaires');

        const document = {
            userId,
            questions,
            answers,
            questionnaire_name,
            timestamp: get_timestamp()
        };

        await questionnaireCollection.insertOne(document);
    } catch (error) {
        console.error("Error saving questionnaire answers:", error);
        throw error; // Rethrow or handle the error based on your application's error management strategy
    }
}


export async function logFinalFeedback(userId: string, feedback: string) {
    try {
        const db = await getDB();
        const feedbackCollection = db.collection('feedback');

        const feedbackData = {
            userId,
            feedback,
            timestamp: get_timestamp()
        };

        await feedbackCollection.insertOne(feedbackData);
        // Connection is managed for reuse, no need to close here
    } catch (error) {
        console.error("Error logging final feedback:", error);
        throw error; // Proper error handling
    }
}


export async function logCompleted(userId: string) {
    try {
        const db = await getDB();
        const usersCollection = db.collection('users');

        await usersCollection.updateOne({userId}, {$set: {completed: true}});
        console.log(`User ${userId} marked as completed.`);
    } catch (error) {
        console.error("Failed to log completion for user:", error);
        throw error; // Depending on your application's needs, you might handle the error differently
    }
}


