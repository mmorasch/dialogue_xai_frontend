import type { RequestHandler } from './$types';
import {logAttentionChecks} from '$lib/pg'
export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    await logAttentionChecks(body.user_id, body.check_id, body.information);
    return new Response('ok');
};