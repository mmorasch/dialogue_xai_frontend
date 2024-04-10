import type {RequestHandler} from './$types';
import {
    assignFinishedProlificParticipant,
    assignFinishedUniParticipant,
    deleteMatrikNum,
    getMatrikNum,
    logCompleted,
    logFinalFeedback
} from '$lib/pg'

export const POST: RequestHandler = async ({request}) => {
    const body = await request.json()
    await logFinalFeedback(body.user_id, body.feedback);
    await logCompleted(body.user_id);
    // TODO: Make conditioned on dataset
    //const matrikelnummer = await getMatrikNum(body.user_id);
    //await assignFinishedUniParticipant(matrikelnummer);
    //await deleteMatrikNum(body.user_id);
    await assignFinishedProlificParticipant(body.user_id);
    return new Response('ok');
};
