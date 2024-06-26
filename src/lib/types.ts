type TGeneralQuestion = {
    id: string;
    question: string;
};

type TFeatureQuestion = TGeneralQuestion;

type TFeatureName = {
    id: string;
    feature_name: string;
};

type TChatMessage = {
    text: string;
    isUser: boolean;
    feedback: boolean;
    id: string;
    feature_id: number;
    followup: (TGeneralQuestion | TFeatureQuestion)[];
    reasoning: string;
};

type TDatapointValueWithHistory = {
    current: string;
    old: string;
};

type TDatapoint = {
    [key: string]: string | TDatapointValueWithHistory;
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
    initial_message: TChatMessage;
    static_report: StaticReport;
    true_label: string;
    prediction_probability: PredictionProbability[];
};

type TInitResult = {
    questions: TQuestionResult;
    feature_tooltips: { [key: string]: string };
    feature_units: { [key: string]: string };
    feature_names: TFeatureName[];
}

type TQuestionResult = {
    general_questions: TGeneralQuestion[];
    feature_questions: TFeatureQuestion[];
};

type TTestingQuestion = {
    id: number;
    question: string;
    answer: string;
    feature_id: number;
};

type TTestOrTeaching = 'test' | 'teaching' | 'final-test' | 'intro-test';

type TInteractiveOrStatic = 'static' | 'interactive' | 'chat';

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