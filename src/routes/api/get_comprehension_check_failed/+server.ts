import type {RequestHandler} from './$types';
import {getComprehensionCheckFailed} from "$lib/pg";

export const POST: RequestHandler = async ({request}) => {
    const body = await request.json();
    const failed = await getComprehensionCheckFailed(body.user_id);
    if (failed) {
        return new Response('failed', {status: 400});
    }
    return new Response('ok');
};