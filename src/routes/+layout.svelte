<script>
	import '../app.postcss';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<main class="grid grid-cols-[1fr_2fr_1fr] gap-x-2 h-[98vh] mt-4">
	<slot />
</main>
