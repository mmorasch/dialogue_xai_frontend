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
    id: number;
    followup: (TGeneralQuestion | TFeatureQuestion)[];
};

type TDatapoint = {
    [key: string]: string
};

type StaticReport = {
    model_prediction: string;
    instance_type: string;
    feature_importance: Record<string, number>;
    opposite_class: string;
    counterfactuals: string;
    anchors: string;
};

type PredictionProbability = {
    label: string;
    probability: string;
};

type TDatapointResult = TDatapoint & {
    current_prediction: string;
    initial_prompt: string;
    static_report: StaticReport;
    true_label: string;
    prediction_probability: PredictionProbability[];
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

type TTestOrTeaching = 'test' | 'teaching' | 'final-test';

type TInteractiveOrStatic = 'static' | 'interactive';

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
    StaticReport,
    TInteractiveOrStatic,
    PredictionProbability
}