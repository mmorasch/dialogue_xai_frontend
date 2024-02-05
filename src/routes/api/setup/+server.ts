import type { RequestHandler } from '../$types';
import { assignStudyGroup, setupUserProfile } from '$lib/backend_pg'

export const POST: RequestHandler = async ({request}) => {
  const body = await request.json()
  await setupUserProfile(body.user_id, body.profile_data);
  return new Response('ok');
};

export const GET: RequestHandler = async () => {
  const res = await assignStudyGroup();
  return new Response(res);
}