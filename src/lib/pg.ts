import postgres from 'postgres'
import {POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST} from "$env/static/private"
import {PUBLIC_BACKEND_URL} from '$env/static/public'

const sql = postgres({
    host: POSTGRES_HOST,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB
})

export async function setupUserProfile(userId: string, profileData: object) {
    return await sql`
        INSERT INTO users (id, profile)
        VALUES (${userId}, ${JSON.stringify(profileData)})
    `
}

export async function assignStudyGroup() {
    const [staticCount, interactiveCount] = await Promise.all([
        sql`SELECT COUNT(*)
            FROM users
            WHERE profile ->> 'study_group' = 'static'`,
        sql`SELECT COUNT(*)
            FROM users
            WHERE profile ->> 'study_group' = 'interactive'`
    ])

    return staticCount <= interactiveCount ? 'static' : 'interactive'
}

export async function logEvent(userId: string,
                               source: string,
                               action: string,
                               details: object) {
    return await sql`
        INSERT INTO events (user_id, source, action, details)
        VALUES (${userId}, ${source}, ${action}, ${JSON.stringify(details)})
    `
}

// ATTENTION!: THIS WILL OVERWRITE THE FIELD `final_questionnaire` IN users.questionnaires IF IT ALREADY EXISTS
// DETAILS: https://www.postgresql.org/docs/current/functions-json.html
export async function saveQuestionnaireAnswers(
    userId: string,
    questions: string[],
    answers: number[],
    questionnaire_name = "final_questionnaire"
) {
    return await sql`
        UPDATE users
        SET questionnaires = questionnaires || ${JSON.stringify(
                {[questionnaire_name]: {questions: questions, answers: answers}}
        )}
        WHERE id = ${userId}
    `
}

export async function logTestingResponse(
    userId: string,
    datapointCount: number,
    test_response: string,
    final = false,
    true_label = ""
) {
    // Generate timestamp without milliseconds
    const timestamp = new Date().toISOString().split('.')[0];

    // Insert log entry into PostgreSQL
    await sql`
        INSERT INTO log_entries (user_id, datapoint_count, test_response, timestamp, true_label, is_final)
        VALUES (${userId}, ${datapointCount}, ${test_response}, ${timestamp}, ${true_label}, ${final})
    `;
    // Log user prediction to backend
    await fetch(`${PUBLIC_BACKEND_URL}set_user_prediction?user_id=${userId}&user_prediction=${test_response}`, {method: 'POST'});
}

export async function logFinalFeedback(userId: string, feedback: string) {
    const timestamp = new Date().toISOString(); // Format the timestamp as an ISO string

    return await sql`
        INSERT INTO feedback (user_id, feedback, timestamp)
        VALUES (${userId}, ${feedback}, ${timestamp})
    `;
}



