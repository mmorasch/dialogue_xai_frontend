import type {RequestHandler} from './$types';
import {getFirstTwoAttentionChecksPassed} from '$lib/pg';

const redirectUrl = 'https://app.prolific.com/submissions/complete?cc=C6V091I4';
export const POST: RequestHandler = async ({request}) => {
    try {
        const body = await request.json();
        const passedChecks = await getFirstTwoAttentionChecksPassed(body.user_id);

        console.log('Passed checks:', passedChecks);

        if (passedChecks) {
            return new Response(JSON.stringify({status: 'Passed'}), {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            });
        } else {
            // Instead of redirecting server-side, send the redirect URL in the response for client-side handling.
            return new Response(JSON.stringify({status: 'Failed', redirectUrl}), {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({status: 'Error', message: 'Error processing request'}), {
            status: 400,
            headers: {'Content-Type': 'application/json'}
        });
    }
};
