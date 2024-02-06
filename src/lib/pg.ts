import postgres from 'postgres'
import {POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST} from "$env/static/private"

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

export async function get_study_group() {
    try {
        // Execute SQL queries to count users in each study group
        const staticCountResult = await sql`SELECT COUNT(*) as count
                                            FROM users
                                            WHERE study_group = 'static' AND completed = true`;
        const interactiveCountResult = await sql`SELECT COUNT(*) as count
                                                 FROM users
                                                 WHERE study_group = 'interactive' AND completed = true`;
        // Extract counts from query results
        const staticCount = parseInt(staticCountResult[0].count, 10);
        const interactiveCount = parseInt(interactiveCountResult[0].count, 10);


        // Determine and return the less used study group
        return staticCount <= interactiveCount ? 'static' : 'interactive';
    } catch (error) {
        console.error('Error in get_study_group:', error);
        throw error; // or handle error as needed
    }
}

export async function set_study_group(userId: string, studyGroup: string) {
    return await sql`
        UPDATE users
        SET study_group = ${studyGroup}
        WHERE id = ${userId}
    `;
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

export async function logFinalFeedback(userId: string, feedback: string) {
    const timestamp = new Date().toISOString();
    logCompleted(userId);
    return await sql`
        UPDATE users
        SET feedback = feedback || ${JSON.stringify(
                {timestamp: timestamp, feedback: feedback}
        )}
        WHERE id = ${userId}
    `;
}

export async function logCompleted(userId: string) {
    return await sql`
        UPDATE users
        SET completed = true
        WHERE id = ${userId}
    `;
}



