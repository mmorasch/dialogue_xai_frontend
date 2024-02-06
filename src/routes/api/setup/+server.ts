import type {RequestHandler} from './$types';
import {set_study_group, setupUserProfile} from '$lib/pg'

export const POST: RequestHandler = async ({request}) => {
    const body = await request.json()
    await setupUserProfile(body.user_id, body.profile_data);
    await set_study_group(body.user_id, body.study_group);
    return new Response('ok');
};

