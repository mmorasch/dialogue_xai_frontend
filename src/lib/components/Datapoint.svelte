<script lang="ts">
	export let header: string[];
	export let body: string[][];
	export let tooltips: { [key: string]: string };
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
			{#each body as row, i}
				<tr title={tooltips[body[i][0].toLowerCase()]}>
					{#each row as col, j}
						<td>{col}</td>
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
</style>
