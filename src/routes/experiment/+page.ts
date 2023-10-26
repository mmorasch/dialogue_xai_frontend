import backend from '$lib/backend';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TDatapointResult } from '$lib/types';

export const load = (async ({ url }) => {
    const user_id = url.searchParams.get('user_id');
    if (user_id === null) throw error(400, 'user_id is required as a query parameter');

    const { questions, feature_tooltip } = await (await backend.xai(user_id).init()).json();
    const {
        datapoint,
        initial_prompt,
        current_prediction
    } = await (await backend.xai(user_id).get_train_datapoint()).json() as TDatapointResult;

    return {
        user_id,
        questions,
        feature_tooltip,
        datapoint,
        initial_prompt,
        current_prediction,
    }
}) satisfies PageLoad;