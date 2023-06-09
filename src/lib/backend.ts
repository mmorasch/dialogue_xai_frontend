import settings from "./settings";

export default {
  xai: {
    get_datapoint: () => fetch(settings.BACKEND + "get_datapoint"),
    sample_prompt: (action: string, thisUserName: string) => fetch(settings.BACKEND + "sample_prompt", { method: "POST", body: JSON.stringify({ action, userName: thisUserName }) }),
    get_questions: () => fetch(settings.BACKEND + "get_questions", { method: "POST" }),
    get_response: (question: number, feature: number) => fetch(settings.BACKEND + "get_response", { method: "POST", body: JSON.stringify({ question, feature }) }),
  },
  firebase: {
    positive_feedback: () => console.log("positive_feedback"),
    negative_feedback: () => console.log("negative_feedback"),
    comment: () => console.log("comment"),
  }
}