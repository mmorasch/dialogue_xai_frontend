import type { RequestHandler } from './$types';
import { saveQuestionnaireAnswers } from '$lib/pg'

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  await saveQuestionnaireAnswers(body.user_id, body.questions, body.answers, body.questionnaire_name);
  return new Response('ok');
};
