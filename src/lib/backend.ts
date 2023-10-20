import { PUBLIC_BACKEND_URL } from '$env/static/public';

export default {
  xai: (user_id: string) => ({
    get_datapoint: () => fetch(PUBLIC_BACKEND_URL + "get_datapoint" + "?user_id=" + user_id),
    get_questions: () => fetch(PUBLIC_BACKEND_URL + "get_questions" +  "?user_id=" + user_id, { method: "POST" }),
    get_current_prediction: () => fetch(PUBLIC_BACKEND_URL + "get_current_prediction" + "?user_id=" + user_id),
    get_response: (question: number, feature: number) => fetch(PUBLIC_BACKEND_URL + "get_response" + "?user_id=" + user_id, { method: "POST", body: JSON.stringify({ question, feature }) }),
    get_feature_tooltips: () => fetch(PUBLIC_BACKEND_URL + "get_feature_tooltips" + "?user_id=" + user_id),
  }),
  firebase: {
    positive_feedback: () => console.log("positive_feedback"),
    negative_feedback: () => console.log("negative_feedback"),
    comment: () => console.log("comment"),
  }
}