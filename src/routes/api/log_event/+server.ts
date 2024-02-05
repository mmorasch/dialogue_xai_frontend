import type { RequestHandler } from './$types';
import { logEvent } from '$lib/pg'

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    const details = body.details || {};

    await logEvent(body.user_id,
        body.event_source,
        body.event_type,
        details,
    );

    return new Response('ok');
};

