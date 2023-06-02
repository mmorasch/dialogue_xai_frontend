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
};

export type {
  TChatMessage,
  TGeneralQuestion,
  TFeatureQuestion,
  TFeatureName
}