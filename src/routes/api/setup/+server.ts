import type {RequestHandler} from './$types';
import {
    createProlificParticipant,
    createUniParticipant,
    set_study_group,
    setMatrikNum,
    setProlificId,
    setupUserProfile
} from '$lib/pg'

export const POST: RequestHandler = async ({request}) => {
    const body = await request.json();
    await setupUserProfile(body.user_id, body.profile_data);
    await set_study_group(body.user_id, body.study_group);
    if (body.matrikelnummer !== undefined) {
        await createUniParticipant(body.matrikelnummer);
        await setMatrikNum(body.user_id, body.matrikelnummer);
    }
    if (body.prolific_id !== undefined) {
        await createProlificParticipant(body.user_id, body.prolific_id);
        await setProlificId(body.user_id, body.prolific_id);
    }
    return new Response('ok');
};