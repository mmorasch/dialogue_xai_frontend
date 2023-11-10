<script lang="ts">
	export let header: string[];
	export let body: string[][];
	export let tooltips: { [key: string]: string };
	import TooltipIcon from './TooltipIcon.svelte';
</script>

<div class="table-container w-[80%] mx-auto">
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
							<span>{col}</span>
							{#if colIndex === 0 && tooltips[col.toLowerCase()]}
								<TooltipIcon message={tooltips[col.toLowerCase()]} />
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
