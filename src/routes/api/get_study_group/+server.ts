import type {RequestHandler} from './$types';
import {get_study_group} from "$lib/pg";

export const GET: RequestHandler = async () => {
    try {
        const studyGroup = await get_study_group();
        return new Response(studyGroup, {
            headers: {'Content-Type': 'text/plain'},
        });
    } catch (error) {
        console.error('Error in GET /api/get_study_group:', error);
        return new Response('Error', {status: 500});
    }
};