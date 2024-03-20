<script lang="ts">
    export let header: string[];
    export let body: string[][];
    export let feature_tooltips: { [key: string]: string };
    export let feature_units: { [key: string]: string };
    export let feature_names: TFeatureName[];
    import TooltipIcon from './TooltipIcon.svelte';
    import type {TFeatureName} from '$lib/types';

    let firstColumnValues = []; // Array to store the values of the first column

    // Populate firstColumnValues with the values of the first column
    $: {
        firstColumnValues = body.map(row => row[0]);
    }

    // Check if prediction_probability row is present in body and if so, remove it
    $: {
        body = body.filter(row => row[0] !== 'prediction_probability');
    }

    // Normalize a string by removing spaces and converting to lower case for comparison
    function normalizeString(str: string): string {
        return str.replace(/\s+/g, '').toLowerCase();
    }

    // Normalize feature_names for comparison
    let normalizedFeatureNames = feature_names.map(f => ({
        original: f,
        normalized: normalizeString(f.feature_name)
    }));

    // Sort body according to normalizedFeatureNames
    let sortedBody = [];
    $: {
        sortedBody = normalizedFeatureNames.reduce((acc, feature) => {
            const bodyRow = body.find(row => normalizeString(row[0]) === feature.normalized);
            if (bodyRow) {
                acc.push(bodyRow);
            }
            return acc;
        }, []);
    }
</script>

<div class="table-container w-[90%] mx-auto">
    <table class="table table-hover">
        <thead>
        <tr>
            {#each header as col, i}
                <th>{col}</th>
            {/each}
        </tr>
        </thead>
        <tbody>
        {#each sortedBody as row}
            <tr>
                <td>
                    <span>{row[0]}</span>
                    {#if feature_tooltips[row[0].toLowerCase()]}
                        <TooltipIcon class="tooltipIcon" message={feature_tooltips[row[0].toLowerCase()]}/>
                    {/if}
                </td>
                <td>
                    {#if feature_units[row[0].toLowerCase()]}
                        <span>{row[1]} {feature_units[row[0].toLowerCase()]}</span>
                    {:else}
                        <span>{row[1]}</span>
                    {/if}
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>


<style lang="postcss">
    .table tbody td {
        padding: 0.2rem;
        min-width: 150px;
        max-width: 150px;
    }

    /* Ensuring the tooltip is not clipped */
    .table-container, .table {
        overflow: visible;
    }

    .tooltipIcon {
        margin: 15px; /* Adjust as needed */
    }
</style>
