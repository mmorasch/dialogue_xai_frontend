<script>
    import {createEventDispatcher, onMount} from 'svelte';
    import {RangeSlider, Step, Stepper} from "@skeletonlabs/skeleton";
    import backend from "$lib/backend";
    import {base} from "$app/paths";

    const dispatch = createEventDispatcher();

    export let user_id;
    let user_correctness_string;

    onMount(async () => {
        const response = await backend.xai(user_id).get_user_correctness();
        user_correctness_string = await response.json();
        //Extract "correctness_string" from the response
        user_correctness_string = user_correctness_string.correctness_string;
    });

    let questions = [
        'I understand the important attributes for a decision.',
        'I cannot distinguish between high risk and low risk patients.',
        'I understand how the ML model works.',
        'I can select number 2 for this question to demonstrate my attention.',
        'I did not understand how the ML model makes decisions.',
    ];

    let answers = Array(questions.length).fill(0);

    async function onComplete() {
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

</script>

<div class="overlay">
    <div class="popup">
        <Stepper stepTerm="Step" on:complete={onComplete} buttonCompleteLabel="Continue Experiment">
            <Step>
                <h2 class="text-2xl">You are done with the initial phase where you had the possibility to learn about
                    the model decision.<br> You correctly answered {user_correctness_string} of the test cases.</h2>
                <p class="text-center text-xl">
                    How would you rate your understanding of the model decision process? <br>
                </p>

                {#each questions as question, i}
                    <div class="flex">
                        <div class="question-column">
                            <span class="question align-middle">
                                {question}
                            </span>
                        </div>
                        <div class="slider-column">
                            <RangeSlider name="range-slider" bind:value={answers[i]} min={-3} max={3} step={1} ticked>
                                <div class="flex justify-between items-center">
                                    <div class="text-xs">Strongly Disagree</div>
                                    <div class="text-xs">Neither agree nor disagree</div>
                                    <div class="text-xs">Strongly Agree</div>
                                </div>
                            </RangeSlider>
                            <div class="labels flex justify-between">
                                <span class="small-text">-3</span>
                                <span class="small-text">-2</span>
                                <span class="small-text">-1</span>
                                <span class="small-text">0</span>
                                <span class="small-text">1</span>
                                <span class="small-text">2</span>
                                <span class="small-text">3</span>
                            </div>
                        </div>
                    </div>
                {/each}
            </Step>
            <Step>
                <p class="text-center text-xl">
                    Now, as a last activity, you will see new patients and will be asked to make a decision whether
                    they are high or low risk patients. <br>
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
        justify-content: space-between;
        margin-bottom: 20px; /* adjust this value to create more space between the rows */
        border-bottom: 1px solid #000; /* add a bottom border to each row */
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
</style>