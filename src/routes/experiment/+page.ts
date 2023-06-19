import backend from '$lib/backend';
import type { TFeatureName, TFeatureQuestion, TGeneralQuestion } from '$lib/types';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
  const datapointPromise = backend.xai.get_datapoint();
  const questionsPromise = backend.xai.get_questions();
  const [datapoint, questions] = await Promise.all([datapointPromise, questionsPromise]);
  const questionsJson = await questions.json();
  const general_questions: TGeneralQuestion[] = questionsJson['general_questions'];
  const feature_questions: TFeatureQuestion[] = questionsJson['feature_questions'];
  const feature_names: TFeatureName[] = questionsJson['feature_names'];
  return {
    datapoint: datapoint.json(),
    general_questions,
    feature_questions,
    feature_names
  };
}) satisfies PageLoad;