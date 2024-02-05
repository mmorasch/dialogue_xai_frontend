import type { RequestHandler } from './$types';
import { saveQuestionnaireAnswers } from '$lib/pg'

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  await saveQuestionnaireAnswers(body.user_id, body.shuffled_questions, body.answers);
  return new Response('ok');
};
