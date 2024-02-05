import type { RequestHandler } from './$types';
import { logFinalFeedback } from '$lib/pg'

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  await logFinalFeedback(body.user_id, body.feedback);
  return new Response('ok');
};
