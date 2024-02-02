import postgres from 'postgres'

const sql = postgres({
  host: 'db',
  username: process.env['POSTGRES_USER'],
  password: process.env['POSTGRES_PASSWORD'],
  database: process.env['POSTGRES_DB']
})

export async function setupUserProfile(userId: string, profileData: object) {
  return await sql`
    INSERT INTO users (id, profile, completed)
    VALUES (${userId}, ${JSON.stringify(profileData)})
  `
}

export async function assignStudyGroup() {
  const [staticCount, interactiveCount] = await Promise.all([
    sql`SELECT COUNT(*) FROM users WHERE profile ->> 'study_group' = 'static'`,
    sql`SELECT COUNT(*) FROM users WHERE profile ->> 'study_group' = 'interactive'`
  ])

  return staticCount <= interactiveCount ? 'static' : 'interactive'
}

export async function logEvent(userId: string, source: string, action: string, details: object) {
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