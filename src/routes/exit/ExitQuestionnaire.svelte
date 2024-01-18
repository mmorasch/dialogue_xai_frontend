<script lang="ts">
    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {RadioGroup, RadioItem, Step, Stepper, tableMapperValues, RangeSlider} from '@skeletonlabs/skeleton';
    import { saveUserAnswers } from '$lib/backend';

    export let user_id; // Add this line

    let questions = [
        // 2 Agent's Usability TODO: Mix
        'The Chatbot is easy to use.',
        'Learning to work with the Chatbot is easy.',
        'Learning how to communicate with the Chatbot is quick',
        // 3 Performance
        'The Chatbot does its task well',
        'The Chatbot does not hinder me',
        'I am capable of succeeding with the Chatbot',
        // 4 Agent’s Likeability
        'The Chatbot\'s appearance is pleasing',
        'I like the Chatbot',
        'I dislike the Chatbot',
        'The Chatbot is cooperative',
        // 5 Agent’s Sociability
        'The Chatbot interacts socially with me',
        // 7 User Acceptance of the Agent
        'I will use the Chatbot again in the future',
        'I oppose further interaction with the Chatbot',
        // 9 User’s Engagement
        //(UE1) [I/Theuser]wasconcentratedduringtheinteractionwith[theagent]
        //(UE2) The interaction captured [my / the user’s] attention
        //(UE3) [I / The user] was alert during the interaction with [the agent]
        // 10 User’s Trust
        //(UT1) [The agent] always gives good advice
        // (UT2) [The agent] acts truthfully
        //(UT3) [I / The user] can rely on [the agent]
        // 11 User-Agent Alliance - 4 + 6
        // 13 Agent’s Coherence all
        // 14 Agent’s Intentionality all

    ];

    // Create Answer Array
    let answers = new Array(11).fill(0);

    // Save Answers to Database
    async function onComplete() {
        // Save the answers when the user completes the questionnaire
        console.log(user_id);
        await saveUserAnswers(user_id, answers);
        goto(`${base}/exit/feedback`);
  }

</script>

<div>
    <!-- https://www.skeleton.dev/components/steppers -->
    <Stepper stepTerm="Question" on:complete={onComplete}>
        <!-- Step 1 -->
        <Step>
            <h1 class="center-text text-xl">Please answer the following questions and give us feedback to improve.</h1>
            {#each questions as question, i}
				<span>
					{question}
				</span>
                <RangeSlider name="range-slider" bind:value={answers[i]} min={-3} max={3} step={1} ticked>
                    <div class="flex justify-between items-center">
                        <div class="text-xs">Disagree</div>
                        <div class="text-xs">Neither agree nor disagree</div>
                        <div class="text-xs">Agree</div>
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
            {/each}
        </Step>
        <!-- Step 2 -->
        <Step>
            <h1 class="center-text text-xl">Thank you for the participation.</h1>
        </Step>
    </Stepper>
</div>

<style>
    .center-text {
        display: block;
        text-align: center;
    }

    .small-text {
        font-size: 0.8em; /* Adjust as needed */
    }
</style>