import settings from "./settings";

export default {
  xai: {
    get_datapoint: () => fetch(settings.BACKEND + "get_datapoint"),
    sample_prompt: (action: string, thisUserName: string) => fetch(settings.BACKEND + "sample_prompt", { method: "POST", body: JSON.stringify({ action, userName: thisUserName }) }),
    get_questions: () => fetch(settings.BACKEND + "get_questions", { method: "POST" }),
    get_current_prediction: () => fetch(settings.BACKEND + "get_current_prediction"),
    get_response: (question: number, feature: number) => fetch(settings.BACKEND + "get_response", { method: "POST", body: JSON.stringify({ question, feature }) }),
    get_feature_tooltips: () => fetch(settings.BACKEND + "get_feature_tooltips"),
  },
  firebase: {
    positive_feedback: () => console.log("positive_feedback"),
    negative_feedback: () => console.log("negative_feedback"),
    comment: () => console.log("comment"),
  }
}