import { PUBLIC_BACKEND_URL } from '$env/static/public';

export default {
  xai: (user_id: string) => ({
    init: () => fetch(PUBLIC_BACKEND_URL + "init" + "?user_id=" + user_id),
    get_train_datapoint: () => fetch(PUBLIC_BACKEND_URL + "get_train_datapoint" + "?user_id=" + user_id),
    get_test_datapoint: () => fetch(PUBLIC_BACKEND_URL + "get_test_datapoint" + "?user_id=" + user_id),
    get_testing_questions: () => fetch(PUBLIC_BACKEND_URL + "get_testing_questions" + "?user_id=" + user_id),
    get_response: (question: number, feature: number) => fetch(PUBLIC_BACKEND_URL + "get_response" + "?user_id=" + user_id, { method: "POST", body: JSON.stringify({ question, feature }) }),
  }),
  firebase: {
    positive_feedback: () => console.log("positive_feedback"),
    negative_feedback: () => console.log("negative_feedback"),
    comment: () => console.log("comment"),
  }
}