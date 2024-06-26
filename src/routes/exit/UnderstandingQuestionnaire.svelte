<script lang="ts">
    import {base} from '$app/paths';
    import {Step, Stepper} from '@skeletonlabs/skeleton';
    import {createEventDispatcher} from "svelte";
    import SubmitButton from "$lib/components/SubmitButton.svelte";

    export let user_id: string;

    const dispatch = createEventDispatcher();

    let most_imp_val = "";
    let lest_imp_val = "";
    let decision_rules_text = "";

    let study_questions = [
        "1. Which attribute was, on average, the <b>most important</b> for the model’s decision?",
        "2. Which attribute was, on average, the <b>least important</b> for the model’s decision?",
        "3. What <b>rules</b> do you think the model uses to <b>differentiate between\n" +
        "                individuals</b> earning over 50k and under 50k?"
    ];

    // Validate form before submitting
    function validateForm() {
        if (!most_imp_val || !lest_imp_val || !decision_rules_text.trim()) {
            alert("Please complete all questions before submitting.");
            return false;
        }
        return true;
    }


    // Save Answers to Database
    async function onComplete() {
        if (!validateForm()) return;

        // Save the answers when the user completes the questionnaire
        await Promise.all([
            fetch(`${base}/api/exit/questionnaire`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    questions: study_questions,
                    answers: [most_imp_val, lest_imp_val, decision_rules_text],
                    correct_answers: ["maritalStatus", "workLifeBalance", "..."],
                    questionnaire_name: 'understanding'
                })
            }),
        ]);
        dispatch('complete');
    }
</script>

<div>
    <!-- https://www.skeleton.dev/components/steppers -->
    <Stepper stepTerm="Final Test">
        <Step>
            <h1 class="center-text text-xl">Almost done! <br> Here are <b>three final questions</b> about your <b>model
                understanding</b>.</h1>
            <div class="flex-container">
                <label class="label text-center flex-item">
                    <span>{@html study_questions[0]}</span>
                    <select bind:value={most_imp_val} class="select py-1">
                        <option value="" selected>- Select -</option>
                        <option value="age">Age</option>
                        <option value="maritalStatus">Marital Status</option>
                        <option value="workExperience">Work Experience</option>
                        <option value="gender">Gender</option>
                        <option value="workLifeBalance">Work Life Balance</option>
                    </select>
                </label>
                <label class="label text-center flex-item">
                    <span>{@html study_questions[1]}</span>
                    <select bind:value={lest_imp_val} class="select py-1">
                        <option value="" selected>- Select -</option>
                        <option value="age">Age</option>
                        <option value="investmentOutcome">Investment Outcome</option>
                        <option value="workLifeBalance">Work Life Balance</option>
                        <option value="gender">Gender</option>
                        <option value="workExperience">Work Experience</option>
                    </select>
                </label>
            </div>
            <br>
            <span>{@html study_questions[2]}</span>
            <textarea bind:value={decision_rules_text} class="textarea-full-width"
                      placeholder="I found that the model uses... I think the model distinguishes by..."></textarea>
            <div class="button-container">
                <SubmitButton next={onComplete} label="Submit" customStyle="padding: 15px; margin-top: 10px;"/>
            </div>
        </Step>
    </Stepper>
</div>

<style>

    .button-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 1em;
    }

    .center-text {
        display: block;
        text-align: center;
    }

    .flex-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1em;
    }

    .flex-item {
        flex: 1;
        margin-right: 1em;
    }

    .flex-item:last-child {
        margin-right: 0;
    }

    .select {
        height: 2.5em; /* Adjust the height as needed */
    }

    .textarea-full-width {
        width: 100%;
        height: 6em; /* Adjust the height as needed */
        resize: vertical; /* Allow users to resize if needed */
    }

    .input-area button {
        @apply rounded-lg cursor-pointer px-8 py-2.5 border-2;
        margin-right: 10px;
    }

</style>