<script>

    import {goto} from "$app/navigation";
    import {base} from "$app/paths";
    import '../../../global.css';
    import {onMount} from 'svelte';
    import {userId, studyGroup} from '$lib/shared.ts';
    import Spinner from '$lib/components/Spinner.svelte';
    import {logAttentionCheck} from '$lib/attentioncheck.ts';
    import SubmitButton from '$lib/components/SubmitButton.svelte';

    let user_id;
    let study_group;

    let isLoading = false;

    onMount(async () => {
        user_id = await userId.get();
        study_group = await studyGroup.get();
    });


    let selected_statement = ""; // To store the user's selection
    const statements = [
        "Assess whether the individual is a good employee",
        "Guess, which machine learning model is used",
        "Guess, whether the machine learning model would predict the individual to earn more or less than 50k a year",
        "Describe how the individual can adap to earn more than 50k a year",
        "Guess whether the individual is a good person",];
    const correct_statement = "Guess, whether the machine learning model would predict the individual to earn more or less than 50k a year";
    const attention_check_counter = "1";
    let attention_check_tries = 0;

    // Function to handle the selection, if needed
    async function handleSelection() {
        // If correct, log and proceed
        if (selected_statement === correct_statement) {
            isLoading = true;
            logAttentionCheck(user_id, attention_check_counter, selected_statement, correct_statement);
            // Use correct function or method for redirection
            await goto(`${base}/experiment?user_id=${user_id}&sg=${study_group}`);
            isLoading = false;
            return; // Prevent further execution
        }
        // Handling incorrect selections
        if (attention_check_tries < 1) {
            attention_check_tries++;
            alert("You have selected the wrong answer. Please read the instructions and try again.");
            selected_statement = ""; // Reset for a new attempt
        } else {
            // Final attempt logic
            logAttentionCheck(user_id, attention_check_counter, selected_statement, correct_statement);
            await alert("ATTENTION: You have selected the wrong answer twice. We ask you to return the study. Please close the survey and click " +
                "'Stop Without Completing' on Prolific.");
            isLoading = true;
            await goto(`${base}/experiment?user_id=${user_id}&sg=${study_group}`);
            isLoading = false;
        }
    }
</script>

<div class="modal">
    <h2>This experiment has three parts as described before. In the learning part, you'll try to guess if a machine
        learning model thinks
        someone earns more or less than $50,000 a year. After guessing, you'll see the model's actual prediction and
        get explanations to understand its reasoning. In the testing parts, you'll make similar guesses without seeing
        the model's reasoning, using what you learned earlier. You'll go through several rounds of this process to
        better grasp how the model makes predictions about different people's earnings.</h2>
    <br>
    {#if isLoading}
        <Spinner dark_background={false}/>
    {/if}
    <p>Based on the task description you read above, when you see a profile of an individual, what will you be asked to
        do?</p>
    <p><i>Pleas re-read the instructions if you are not sure. You will have two opportunities to get this question
        correct.</i></p>
    <select bind:value={selected_statement} class="select">
        <option value="" disabled selected>Select the correct statement</option>
        {#each statements as statement}
            <option value={statement}>{statement}</option>
        {/each}
    </select>
    <SubmitButton next={handleSelection}
                  customStyle="padding: 10px; margin-top: 10px;" />
</div>

<style>
    html, body {
        height: 100%;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
    }

    /* Directly style the modal for centering, width is up to your design */
    .modal {
        width: 500px; /* Or whatever width you prefer */
        padding: 20px;
        padding-bottom: 100px; /* Adjust this value to the height of your submit button plus some extra space */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        background: white; /* or any color you prefer */
        border-radius: 4px; /* Optional: for rounded corners */
        position: fixed; /* This will ensure the modal is positioned in relation to the viewport */
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* This will center the modal perfectly */
        z-index: 1000; /* Ensure it's above other content */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .select {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
    }

</style>
