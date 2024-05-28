<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import {RadioGroup, RadioItem, Step, Stepper} from "@skeletonlabs/skeleton";
    import backend from "$lib/backend";
    import {base} from "$app/paths";
    import {writable} from 'svelte/store';
    import QuestionButton from '$lib/components/QuestionButton.svelte';
    import {logAttentionCheck} from '$lib/attentioncheck.ts';


    const dispatch = createEventDispatcher();

    export let user_id;
    export let feature_questions;
    export let general_questions;

    export let study_group;

    let user_correctness_string;

    onMount(async () => {
        const response = await backend.xai(user_id).get_user_correctness();
        user_correctness_string = await response.json().then(data => {
            return data.correctness_string;
        })
    });

    // Setup questions and attention check
    let questions = [
        'I understand the important attributes for a decision.',
        'I cannot distinguish between the possible prediction.',
        'I understand how the Machine Learning model works.',
        'Select "Strongly Disagree" for this selection.',
        'I did not understand how the Machine Learning model makes decisions.'
    ];
    const attention_check_question_id = 3;
    const correct_attribute = '-2';
    const attention_check_id = "3";

    let answers = Array(questions.length).fill(0);

    // Change [current prediction] placeholder
    general_questions = general_questions.map(question => {
        question.question = question.question.replace('[current prediction]', 'the current prediction');
        return question;
    });

    // Change [feature selection] placeholder
    feature_questions = feature_questions.map(question => {
        question.question = question.question.replace('[feature selection]', 'this feature');
        return question;
    });

    // Combine the feature and general questions
    let ttm_questions = [
        ...general_questions,
        ...feature_questions
    ];

    let selectedValues = [];

    async function onComplete() {
        // Log attention check seperately
        let user_answer = answers[attention_check_question_id].toString();
        await logAttentionCheck(user_id, attention_check_id, user_answer, correct_attribute);

        //merge selectedGeneralValues and selectedFeatureValues
        selectedValues = [...$selectedGeneralValues, ...$selectedFeatureValues];

        // Save questions ranking
        await fetch(`${base}/api/exit/questionnaire`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                questions: ttm_questions,
                answers: selectedValues,
                questionnaire_name: 'question_ranking'
            })
        });
        // Save the answers when the user completes the questionnaire
        await fetch(`${base}/api/exit/questionnaire`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                questions: questions,
                answers: answers,
                questionnaire_name: 'self_assessment'
            })
        });
        dispatch('confirm');
    }

    // Assuming you know the length of questions arrays beforehand or they are dynamically provided
    let generalQuestionsLength = general_questions.length;
    let featureQuestionsLength = feature_questions.length;
    let totalQuestionsLength = general_questions.length + feature_questions.length;
    let staticExplanationLabels = [
        '1. Attribute ranking',
        '2. Possible alternative scenarios',
        '3. Decision rules for similar people',
        '4. What would happen if individual attributes were changed?',
        '5. Attribute ranges and frequencies'];

    let chatExplanationLabels = [
        '1. Visualisation of attribute influences',
        '2. Top 3 impacting attributes',
        '3. Least 3 impacting attributes',
        '4. Attribute changes that lead to a model prediction change',
        '5. Attributes that most definitely predict current outcome',
        '6. If change of individual attribute can change model prediction',
        '7. Attribute ranges and frequencies',
    ];

    let explanationsOrQuestions;
    if (study_group === 'interactive') {
        explanationsOrQuestions = ttm_questions;
    } else if (study_group === 'static') {
        explanationsOrQuestions = staticExplanationLabels;
    } else { // chat
        explanationsOrQuestions = chatExplanationLabels;
    }
    let totalItemsLength = explanationsOrQuestions.length;

    const selectedGeneralValues = writable(Array(generalQuestionsLength).fill(''));
    const selectedFeatureValues = writable(Array(featureQuestionsLength).fill(''));

    import {derived} from 'svelte/store';

    // Create a derived store to calculate disabled options based on selections in both question types
    const disabledOptions = derived(
        [selectedGeneralValues, selectedFeatureValues],
        ([$selectedGeneralValues, $selectedFeatureValues]) => {
            const disabled = [...$selectedGeneralValues, ...$selectedFeatureValues].filter(val => val !== '');
            return disabled;
        }
    );
</script>

<div class="overlay">
    <div class="popup">
        <Stepper stepTerm="Step" on:complete={onComplete} buttonCompleteLabel="Continue Experiment">
            {#if study_group === 'interactive'}
                <Step>
                    <h1 class="center-text text-xl">Please <b>rank the questions</b> based on their usefulness, where
                        <b>1 is the
                            most useful</b> question. <br> (<b>Usefull</b> as in helpful to understand the model's
                        decision process.)</h1>
                    <!-- General Questions -->
                    <div class="flex flex-col my-[5px]">
                        <h2>General Questions</h2>
                        {#each general_questions as question, index}
                            <div class="flex my-[5px]">
                                <select bind:value={$selectedGeneralValues[index]} class="select-margin">>
                                    <option value="">Select a rank</option>
                                    {#each Array(totalQuestionsLength).fill().map((_, i) => i + 1) as rank}
                                        <option value={rank} disabled={$disabledOptions.includes(rank)}>
                                            {rank}
                                        </option>
                                    {/each}
                                </select>
                                <QuestionButton type="general" question={question.question} questionId={question.id}/>
                            </div>
                        {/each}
                    </div>

                    <!-- Feature Questions -->
                    <div class="flex flex-col my-[5px]">
                        <h2>Attribute Related Questions</h2>
                        {#each feature_questions as question, index}
                            <div class="flex my-[5px]">
                                <select bind:value={$selectedFeatureValues[index]} class="select-margin">>
                                    <option value="">Select a rank</option>
                                    {#each Array(totalQuestionsLength).fill().map((_, i) => i + 1) as rank}
                                        <option value={rank} disabled={$disabledOptions.includes(rank)}>
                                            {rank}
                                        </option>
                                    {/each}
                                </select>
                                <QuestionButton type="general" question={question.question} questionId={question.id}/>
                            </div>
                        {/each}
                    </div>
                </Step>
            {:else if study_group === 'chat'}
                <Step>
                    <h1 class="center-text text-xl">Please <b>rank the explanations</b> based on their usefulness,
                        where <b>1 is the most useful</b> explanation. <br> (<b>Useful</b> as in helpful to understand the
                        model's decision process.) <br> If you did <b>not receive</b> one of the explanations, mark them as -1. <br>
                        You can see how the explanations looked like in the chat in the <b>image on the bottom of the page</b>.</h1>
                    <!-- Adjusted Ranking UI for chat explanations -->
                    <div class="flex flex-col my-[5px]">
                        {#each explanationsOrQuestions as item, index}
                            <div class="flex my-[5px]">
                                <select bind:value={$selectedGeneralValues[index]} class="select-margin">
                                    <option value="">Select a rank</option>
                                    {#each [-1, ...Array(totalQuestionsLength).fill().map((_, i) => i + 1)] as rank}
                                        <option value={rank} disabled={rank !== -1 && $disabledOptions.includes(rank)}>
                                            {rank}
                                        </option>
                                    {/each}
                                </select>
                                <span>{item}</span>
                            </div>
                        {/each}
                    </div>
                    <p>You can see a screenshot of all possible explanations below:</p>
                    <img src="{base}/ChatExplanationsImage.png" alt="Chat Explanations Image">
                </Step>
            {:else}
                <Step>
                    <h1 class="center-text text-xl">Please <b>rank the explanations</b> based on their usefulness, where
                        <b>1 is the
                            most useful</b> question. <br> (<b>Usefull</b> as in helpful to understand the model's
                        decision process.)</h1>
                    <!-- Adjusted Ranking UI for static explanations -->
                    <div class="flex flex-col my-[5px]">
                        {#each explanationsOrQuestions as item, index}
                            <div class="flex my-[5px]">
                                <select bind:value={$selectedGeneralValues[index]} class="select-margin">
                                    <option value="">Select a rank</option>
                                    {#each Array(totalItemsLength).fill().map((_, i) => i + 1) as rank}
                                        <option value={rank} disabled={$disabledOptions.includes(rank)}>
                                            {rank}
                                        </option>
                                    {/each}
                                </select>
                                <span>{item}</span>
                                <!-- For explanations, item is a label; for questions, it might need adjustment -->
                            </div>
                        {/each}
                    </div>
                    <p>You can see a screenshot of the explanations to remember how they looked like here:</p>
                    <img src="{base}/StaticReportImage.png" alt="Static Report Image">
                </Step>
            {/if}
            <Step>
                <h1 class="text-center text-2xl">You are done with the <b>explanation phase</b> <br> where you had the
                    possibility to learn about the model's decision.
                    <br><br>
                    You <b>correctly answered {user_correctness_string}</b> of the test cases.</h1>
            </Step>
            <Step>
                <p class="text-center text-xl">
                    How would you rate your understanding of the model's decision process? <br>
                </p>

                {#each questions as question, i}
                    <div class="slider-flex">
                        <div class="question-column">
                            <span class="question align-middle">
                                {question}
                            </span>
                        </div>
                        <div class="slider-column">
                            <RadioGroup>
                                <RadioItem name="likert" bind:group={answers[i]} value={-2}>Strongly disagree
                                </RadioItem>
                                <RadioItem name="likert" bind:group={answers[i]} value={-1}>Somewhat disagree
                                </RadioItem>
                                <RadioItem name="likert" bind:group={answers[i]} value={1}>Somewhat agree</RadioItem>
                                <RadioItem name="likert" bind:group={answers[i]} value={2}>Strongly agree</RadioItem>
                            </RadioGroup>
                        </div>
                    </div>
                    <hr>
                {/each}
            </Step>
            <Step>
                <p class="text-center text-xl">
                    <b>Almost done!</b><br> <br>

                    As a <b>last activity</b>, you will see new indidivuals<br> and will be asked to make a decision on what
                    you think the model will predict for them. <br> You will not see explanations.<br>
                </p>
            </Step>
        </Stepper>
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .popup {
        position: relative;
        width: 80%;
        height: 80%;
        background-color: white;
        border-radius: 10px;
        padding: 40px;
        box-sizing: border-box;
        overflow: auto;
    }

    .flex {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px; /* adjust this value to create more space between the rows */
    }

    .slider-flex {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px; /* adjust this value to create more space between the rows */

        align-items: center;
    }

    .question-column {
        flex: 0.25; /* this will make the question column take up 25% of the total width */
        margin-right: 20px;
        align-items: center;
    }

    .slider-column {
        flex: 0.75; /* this will make the slider column take up 75% of the total width */
    }

    .text-center {
        margin-bottom: 30px; /* adjust this value to create more space */
    }

    /* Style the selection field like tailwind */
    select {
        @apply rounded-lg bg-[whitesmoke] cursor-pointer mx-0 my-[5px] px-5 py-3.5 border-2;
    }

    .select-margin {
        margin-right: 20px; /* adjust this value to create more space */
        padding-right: 35px;
    }

</style>