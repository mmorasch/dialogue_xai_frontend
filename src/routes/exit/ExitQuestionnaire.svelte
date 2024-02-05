<script lang="ts">
    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {Step, Stepper, RangeSlider} from '@skeletonlabs/skeleton';
    import backend, {logFinalFeedback, saveQuestionnaireAnswers} from '$lib/backend_pg';
    export let user_id;
    let currentStep = 0;

    function onNext() {
        currentStep++;
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
    }

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
        'I like the Chatbot.',
        'I dislike the Chatbot.',
        'The Chatbot is cooperative.',
        // 5 Agent’s Sociability
        'The Chatbot interacts socially with me.',
        // 7 User Acceptance of the Agent
        'I can see myself using the Chatbot in the future.',
        // 9 User’s Engagement
        'I was concentrated during the interaction with the chatbot.',
        'The interaction captured my attention.',
        'I was alert during the interaction with the chatbot.',
        // 10 User’s Trust
        'The chatbot always gives good advice.',
        'The chatbot acts truthfully.',
        'I can rely on the chatbot.',
        // 11 User-Agent Alliance
        'The chatbot can collaborate in a productive way.',
        'The chatbot understands me.',
        // 13 Agent’s Coherence
        'The chatbots’s behavior does not make sense.',
        'The chatbots is inconsistent.',
        'The chatbots appears confused.',
        // 14 Agent’s Intentionality
        'The chatbot acts intentionally',
        'The chatbot has no clue of what it is doing.',
    ];

    let shuffled_questions = [
        "The Chatbot is cooperative.",
        "I like the Chatbot.",
        "The chatbot has no clue of what it is doing.",
        "The chatbot always gives good advice.",
        "The chatbot can collaborate in a productive way.",
        "The chatbot acts truthfully.",
        "The chatbots appears confused.",
        "The Chatbot interacts socially with me.",
        "The chatbot acts intentionally",
        "I can see myself using the Chatbot in the future.",
        "I can rely on the chatbot.",
        "The Chatbot is easy to use.",
        "The chatbot understands me.",
        "I was concentrated during the interaction with the chatbot.",
        "Learning to work with the Chatbot is easy.",
        "The interaction captured my attention.",
        "The chatbots’s behavior does not make sense.",
        "The Chatbot does its task well",
        "The chatbots is inconsistent.",
        "Learning how to communicate with the Chatbot is quick",
        "I dislike the Chatbot.",
        "The Chatbot does not hinder me",
        "I am capable of succeeding with the Chatbot",
        "I was alert during the interaction with the chatbot."
    ];

    let chunks = [];
    for (let i = 0; i < shuffled_questions.length; i += 6) {
        chunks.push(shuffled_questions.slice(i, i + 7));
    }


    // Create Answer Array
    let answers = new Array(11).fill(0);

    let feedback = "";

    // Save Answers to Database
    async function onComplete() {
        // Save the answers when the user completes the questionnaire
        await saveQuestionnaireAnswers(user_id, shuffled_questions, answers);
        await logFinalFeedback(user_id, feedback);
        await backend.xai(user_id).finish();
        goto(`${base}/exit/feedback`);
    }
</script>

<div>
    <!-- https://www.skeleton.dev/components/steppers -->
    <Stepper {currentStep} stepTerm="Questions" on:step={onNext} on:complete={onComplete}>
        <!-- Step 1 -->
        {#each chunks as chunk, chunkIndex}
            <Step>
                <h1 class="center-text text-xl">Please answer the following questions and give us feedback to
                    improve.</h1>
                {#each chunk as question, i}
                    <div class="flex">
                        <div class="question-column">
                    <span class="question align-middle">
                        {question}
                    </span>
                        </div>
                        <div class="slider-column">
                            <RangeSlider name="range-slider" bind:value={answers[chunkIndex * 7 + i]} min={-3} max={3}
                                         step={1} ticked>
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
                        </div>
                    </div>
                {/each}
            </Step>
        {/each}
        <!-- Step 2 -->
        <Step>
            <h1 class="center-text text-xl">Thank you for the participation!</h1>
            <h2>Since this is the prestudy, please leave any opinion and your name here so we can talk and I can link the
                experiment results to you for further analysis together. :)</h2>
            <textarea class="feedback-textarea" bind:value={feedback}></textarea> <!-- Bind the value here -->
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

    .flex {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px; /* adjust this value to create more space between the rows */
        border-bottom: 1px solid #000; /* add a bottom border to each row */
        align-items: center;
    }

    /* remove the bottom border from the last row */
    .flex:last-child {
        border-bottom: none;
    }

    .question-column {
        flex: 0.25; /* this will make the question column take up 25% of the total width */
        margin-right: 20px;
        align-items: center;
    }

    .slider-column {
        flex: 0.75; /* this will make the slider column take up 75% of the total width */
    }

    .feedback-textarea {
        width: 100%; /* adjust as needed */
        height: 100px; /* adjust as needed */
        padding: 10px;
        margin-top: 20px;
        box-sizing: border-box;
    }

</style>