import type {RequestHandler} from './$types';
import {get_study_group} from "$lib/pg";

export const GET: RequestHandler = async () => {
    try {
        let studyGroup = await get_study_group();
        // TODO: REMOVE LATER. Set study group to interactive
        studyGroup = 'interactive';
        return new Response(studyGroup, {
            headers: {'Content-Type': 'text/plain'},
        });
    } catch (error) {
        console.error('Error in GET /api/get_study_group:', error);
        return new Response('Error', {status: 500});
    }
};