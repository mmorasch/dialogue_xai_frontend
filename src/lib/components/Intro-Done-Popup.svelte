<script>
    import {createEventDispatcher} from 'svelte';
    import {Step, Stepper} from "@skeletonlabs/skeleton";

    const dispatch = createEventDispatcher();

    export let study_group;

    let teaching_intro = "";


    async function onComplete() {
        dispatch('confirm');
    }

    const taskDescription = "Your <b>next task</b> will once again be to <b>guess the income of the person</b>, based on the shown information.<br><br>";
    const followUpActionStatic = "Afterward, you can see the AI's prediction and read the provided explanations";
    const followUpActionDynamic = "Afterward, you can see the AI's prediction and choose to ask questions through the chatbot";
    const commonConclusion = "to <b>understand the reason for the model's prediction</b> and enhance your understanding of the decision-making process.";

    teaching_intro = `${taskDescription} ${study_group === 'static' ? `${followUpActionStatic} ${commonConclusion}.` : `${followUpActionDynamic} ${commonConclusion}.`}`;

</script>

<div class="overlay">
    <div class="popup">
        <Stepper stepTerm="Step" on:complete={onComplete} buttonCompleteLabel="Continue Experiment">
            <Step>
                <h1 class="text-center text-xl">You are done with the first phase.</h1>
            </Step>
            <Step>
                <h1 class=" text-center text-xl">{@html teaching_intro}</h1>
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

    .text-center {
        margin-bottom: 30px; /* adjust this value to create more space */
        max-width: 50%;
        margin: auto;
    }

</style>