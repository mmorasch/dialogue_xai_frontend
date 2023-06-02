<script lang="ts"></script>

<header>
	<slot />
</header>

<style lang="postcss">
	header {
		@apply flex justify-between text-center items-center border-b-[length:var(--border)] text-[#666] mb-4 p-2.5;
		background: #eee;
	}
</style>
