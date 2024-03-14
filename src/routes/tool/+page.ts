import backend from '$lib/backend';
import {error} from '@sveltejs/kit';
import type {PageLoad} from './$types';
import type {TDatapointResult} from '$lib/types';

/**
 * experiment start: creates the experiment with the user_id
 * in the backend and gets questions, feature_tooltips and feature_units,
 * afterwards it loads the first datapoint and the initial prompt and
 * returns all information to the frontend.
 *
 * waterfall model, nothing runs in parallel
 * init -> get_train_datapoint -> return data to frontend
 */
export const load = (async ({url}) => {
    // backend returns data that is either questions or report (A/B study design)
    const user_id = "";
    const study_group = "interactive";

    const {
        questions,
        feature_tooltips,
        feature_units,
        prediction_choices
    } = await (await backend.xai(user_id, study_group).init()).json();

    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id,
        initial_prompt,
        current_prediction,
        static_report,
        prediction_probability,
        ...datapoint
    } = await (await backend.xai(user_id).get_train_datapoint()).json() as TDatapointResult;
    return {
        user_id,
        study_group,
        questions,
        feature_tooltips,
        feature_units,
        prediction_choices,
        datapoint,
        initial_prompt,
        current_prediction,
        static_report,
        prediction_probability
    }

}) satisfies PageLoad;