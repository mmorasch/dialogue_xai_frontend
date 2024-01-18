import backend from '$lib/backend';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { TDatapointResult } from '$lib/types';

/**
 * experiment start: creates in the experiment with the user_id
 * in the backend and gets questions, feature_tooltips and feature_units,
 * afterwards it loads the first datapoint and the initial prompt and
 * returns all information to the frontend.
 *
 * waterfall model, nothing runs in parallel
 * init -> get_train_datapoint -> return data to frontend
 */
export const load = (async ({ url }) => {
    const user_id = url.searchParams.get('user_id');
    if (user_id === null) throw error(400, 'user_id is required as a query parameter');

    const { questions, feature_tooltips, feature_units } = await (await backend.xai(user_id).init()).json();
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id,
        initial_prompt,
        current_prediction,
        ...datapoint
    } = await (await backend.xai(user_id).get_train_datapoint()).json() as TDatapointResult;

    return {
        user_id,
        questions,
        feature_tooltips,
        feature_units,
        datapoint,
        initial_prompt,
        current_prediction,
    }
}) satisfies PageLoad;