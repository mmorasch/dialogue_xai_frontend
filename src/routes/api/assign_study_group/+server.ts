import type {RequestHandler} from './$types';
import {assignStudyGroup} from "$lib/pg";

export const GET: RequestHandler = async () => {
    const res = await assignStudyGroup();
    return new Response(res);
}