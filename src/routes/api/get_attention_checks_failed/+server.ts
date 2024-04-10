import type {RequestHandler} from './$types';
import {getTwoAttentionChecksFailed} from "$lib/pg";

export const POST: RequestHandler = async ({request}) => {
    const body = await request.json();
    const failed = await getTwoAttentionChecksFailed(body.user_id);
    if (failed) {
        return new Response('failed', {status: 400});
    }
    return new Response('ok');
};