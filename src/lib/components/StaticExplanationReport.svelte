<script lang="ts">
    import Header from "$lib/components/Header.svelte";

    export let static_report;
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    let model_prediction = static_report.model_prediction;
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
        <h3>The model predicts <b>{model_prediction}</b> for the current {instance_type}. Here are
            explanations for the prediction:</h3>
        <div class="grid-container">
            <div class="grid-item" style="grid-area: area1;">
                <br>
                <h1>1. Attribute Ranking</h1>
                <h3>Each <b>attribute has a contribution</b> to the decision. The attributions are of different
                    strengths and can contribute toward the prediction of likely or unlikely. The strength is shown on the x-axis:</h3>
                <div class="feature-importance-plot">
                    {@html feature_importance}
                </div>
            </div>

            <div class="grid-item" style="grid-area: area2;">
                <br>
                <h1>2. Alternative Scenarios</h1>
                <h3>The model would predict <b>{opposite_class}</b> if the following features were changed:</h3>
                <p>{@html counterfactuals}</p>
            </div>

            <div class="grid-item" style="grid-area: area3;">

                <h1>3. Attribute Ranges</h1>
                <div class="table-container w-[80%]">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th>Attribute</th>
                            <th>Minimum</th>
                            <th>Maximum</th>
                            <th>Mean</th>
                        </tr>
                        </thead>
                        <tbody>
                        {#each Object.keys(feature_statistics) as feature_name}
                            <tr>
                                <td>
                                    <span>{feature_name}</span>
                                </td>
                                <td>
                                    <span>{feature_statistics[feature_name].min}</span>
                                </td>
                                <td>
                                    <span>{feature_statistics[feature_name].max}</span>
                                </td>
                                <td>
                                    <span>{feature_statistics[feature_name].mean}</span>
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="grid-item" style="grid-area: area4;">
                <br>
                <h1>4. Changes not impacting the prediction</h1><br>
                <h3>As long as the following conditions apply, the model will predict
                    <b>{model_prediction}</b>:</h3>
                <p>{@html anchors}</p>
            </div>

            <div class="grid-item" style="grid-area: area5;">
                <br>
                <h1>5. What would happen to this patient if individual attributes were higher or lower?</h1><br>
                {#each ceteris_paribus as statement}
                    <p>{@html statement}</p> <br>
                {/each}
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

</style>