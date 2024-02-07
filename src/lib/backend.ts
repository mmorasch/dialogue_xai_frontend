import {PUBLIC_BACKEND_URL} from "$env/static/public";

export default {
    xai: (user_id: string, study_group = 'A') => ({
        init: () => fetch(`${PUBLIC_BACKEND_URL}init?user_id=${user_id}&study_group=${study_group}`),
        get_user_correctness: () => fetch(`${PUBLIC_BACKEND_URL}get_user_correctness?user_id=${user_id}`),
        finish: () => fetch(PUBLIC_BACKEND_URL + "finish" + "?user_id=" + user_id, {method: 'DELETE',}),
        get_train_datapoint: () => fetch(PUBLIC_BACKEND_URL + "get_train_datapoint" + "?user_id=" + user_id),
        get_test_datapoint: () => fetch(PUBLIC_BACKEND_URL + "get_test_datapoint" + "?user_id=" + user_id),
        get_testing_questions: () => fetch(PUBLIC_BACKEND_URL + "get_testing_questions" + "?user_id=" + user_id),
        get_response: (question: number, feature: number) => fetch(PUBLIC_BACKEND_URL + "get_response" + "?user_id=" + user_id, {
            method: "POST",
            body: JSON.stringify({question, feature})
        }),
        set_user_prediction: (user_prediction: string) => fetch(PUBLIC_BACKEND_URL + 'set_user_prediction' + `?user_id=${user_id}`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_prediction})
        }),
    }),
}
