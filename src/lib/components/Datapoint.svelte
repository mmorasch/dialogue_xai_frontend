<script lang="ts">
  import { writable } from 'svelte/store';
  export let header: string[];
  export let body: string[][];
  export let feature_tooltips: { [key: string]: string };
  export let feature_units: { [key: string]: string };
  export let feature_names: TFeatureName[];
  import TooltipIcon from './TooltipIcon.svelte';
  import type { TFeatureName } from '$lib/types';

  let rowIndexStore = writable(0);

  let firstColumnValues = []; // Array to store the values of the first column

  // Populate firstColumnValues with the values of the first column
  $: {
    firstColumnValues = body.map(row => row[0]);
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
      {#each body as row, rowIndex}
      <tr>
        {#each row as col, colIndex}
        <td>
          {#if colIndex === 0}
          <span>{feature_names[rowIndex]?.feature_name}</span>
          {#if feature_tooltips[col.toLowerCase()]}
          <TooltipIcon message={feature_tooltips[col.toLowerCase()]} />
          {/if}
          {:else}
          <span>{col} {feature_units[firstColumnValues[rowIndex]?.toLowerCase()]}</span>
          {/if}
        </td>
        {/each}
      </tr>
      {/each}
    </tbody>
  </table>
</div>



<style lang="postcss">
    .table tbody td {
        padding: 0.25rem;
    }

    /* Ensuring the tooltip is not clipped */
    .table-container, .table {
        overflow: visible;
    }
</style>
