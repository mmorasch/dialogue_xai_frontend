type TGeneralQuestion = {
  id: number;
  question: string;
};

type TFeatureQuestion = TGeneralQuestion;

type TFeatureName = {
  id: number;
  feature_name: string;
};

type TChatMessage = {
  text: string;
  isUser: boolean;
  feedback: boolean;
};

type TDatapoint = {
  [key: string]: string
};

type TDatapointResult = TDatapoint & {
  current_prediction: string;
  initial_prompt: string;
};

type TInitResult = {
  questions: TQuestionResult;
  feature_tooltips: { [key: string]: string };
  feature_units: { [key: string]: string };
}

type TQuestionResult = {
  general_questions: TGeneralQuestion[];
  feature_questions: TFeatureQuestion[];
  feature_names: TFeatureName[];
};

type TTestingQuestion = {
  id: number;
  question: string;
  answer: string;
  feature_id: number;
};

type TTestOrTeaching = 'test' | 'teaching';

export type {
  TChatMessage,
  TDatapointResult,
  TDatapoint,
  TFeatureName,
  TFeatureQuestion,
  TGeneralQuestion,
  TInitResult,
  TQuestionResult,
  TTestingQuestion,
  TTestOrTeaching,
}