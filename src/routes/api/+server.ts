import type { RequestHandler } from './$types';
import { setupUserProfile } from '$lib/backend_pg'

export const POST: RequestHandler = async ({request}) => {
  const body = await request.json()
  await setupUserProfile(body.username, body.password);
  return new Response('ok');
};