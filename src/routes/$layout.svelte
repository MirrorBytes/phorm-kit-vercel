<script>
	import '../global.css';

	import Nav from '$lib/Nav.svelte';
</script>

<main class="font-sans antialiased">
	<div class="min-h-screen flex flex-col">
		<Nav />

		<div class="flex-1 flex flex-col w-full relative">
			<slot />
		</div>
	</div>
</main>
