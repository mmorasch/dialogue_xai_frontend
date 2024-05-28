<script lang="ts">
    import Header from "$lib/components/Header.svelte";

    export let static_report;
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();
    export let instance_prediction: string;
    let instance_type = static_report.instance_type;
    let feature_importance = static_report.feature_importance;
    let opposite_class = static_report.opposite_class;
    let counterfactuals = static_report.counterfactuals;
    let anchors = static_report.anchors;
    let feature_statistics = static_report.feature_statistics;
    let ceteris_paribus = static_report.ceteris_paribus;


    async function next(e: any) {
        e.preventDefault();
        dispatch('next', null);
    }
</script>

<div
        class="ttm flex h-full"
>
    <Header>Explanation Report</Header>

    <main class="flex-1 overflow-y-auto h-full p-3">
        <h1>Prediction</h1>
        <h3>The model predicts <b>{instance_prediction}</b> for the current {instance_type}. Here are
            explanations for the prediction:</h3>
        <div class="grid-container">
            <div class="grid-item" style="grid-area: area1;">
                <br>
                <h1>1. Attribute ranking</h1>
                <h3>Each <b>attribute has a contribution</b> to the decision. <br>The attributions are of different
                    strengths and can contribute toward or against the current AI prediction. <br>The strength is
                    indicated on
                    the bottom:</h3>
                <div class="feature-importance-plot">
                    {@html feature_importance}
                </div>
                <hr class="my-5">
            </div>


            <div class="grid-item" style="grid-area: area2;">
                <br>
                <h1>2. Possible alternative scenarios</h1>
                <h3>The model would predict <b>{opposite_class}</b> if any of the following features change scenarios
                    was applied:</h3>
                <p>{@html counterfactuals}</p>
                <hr class="my-5">
            </div>

            <div class="grid-item" style="grid-area: area3;">
                <br>
                <h1>3. Decision rules for similar people</h1><br>
                <h3>This group of attributes most definetly predicts <b>{instance_prediction}</b>:</h3>
                <p>{@html anchors}</p>
                <hr class="my-5">
            </div>

            <div class="grid-item" style="grid-area: area4;">
                <br>
                <h1>4. What would happen if individual attributes were changed?</h1><br>
                {#each ceteris_paribus as statement}
                    <p>{@html statement}</p> <br>
                {/each}
                <hr class="my-5">
            </div>

            <div class="grid-item" style="grid-area: area5;">

                <h1>5. Attribute ranges and frequencies</h1>
                <div class="table-container w-[80%]">
                    <ul>
                        {#each Object.keys(feature_statistics) as feature_name}
                            {#if `${feature_statistics[feature_name]}`.startsWith('<img')}
                                <li class="small-figure">
                                    {feature_name} <br> {@html feature_statistics[feature_name]}
                                </li>
                            {:else}
                                <li>
                                    {feature_name} <br> {@html feature_statistics[feature_name]}
                                </li>
                            {/if}
                        {/each}
                    </ul>
                </div>
            </div>

            <div class="grid-item" style="grid-area: area5;">
                <input class=""
                       type="submit"
                       value="Proceed"
                       style="width: 10%;"
                       on:click|preventDefault={next}
                />
            </div>
        </div>
    </main>
</div>

<style lang="postcss">
    input[type='submit'] {
        @apply bg-[black] text-[white] rounded-lg cursor-pointer mx-0 my-[5px] px-5 py-3.5 border-[none];
        position: absolute;
        bottom: 2vh;
        right: 4vh;
        left: auto;
    }

    .ttm {
        flex-flow: column wrap;
        background: var(--ttm-bg);
        min-height: 97vh;
        max-height: 97vh;
    }


    .feature-importance-plot {
        width: 50%; /* adjust this value to change the width of the image */
        height: auto; /* this will maintain the aspect ratio of the image */
    }

    .grid-container {
        display: grid;
        grid-template-areas:
    "area1" "area2" "area3" "area4" "area5";
        grid-gap: 10px; /* adjust this value to change the gap between grid items */
    }

    h1 {
        color: black;
        font-size: 20px;
        font-weight: bold;
    }

    .table tbody td {
        padding: 0.25rem;
    }

    /* Ensuring the tooltip is not clipped */
    .table-container, .table {
        overflow: visible;
    }

    .small-figure {
        width: 50%; /* adjust this value to change the width of the figure */
        height: auto; /* this will maintain the aspect ratio of the figure */
    }

</style>