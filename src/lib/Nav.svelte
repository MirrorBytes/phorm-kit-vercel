<script lang="ts">
	import { page } from '$app/stores';

	import { authTrigger } from '../stores';
	import { checkForUser } from '../utils/user';

	let open = false;
	let hasUser = false;

	authTrigger.subscribe(() => {
		hasUser = checkForUser();
	});

	const commit = () => {
		//
	};
</script>

<nav>
	<div class="wrapper">
		<div class="mobile-wrapper">
			<a href="/" class="logo">phorm</a>

			<button
				aria-label={open ? 'Close Menu' : 'Open Menu'}
				aria-expanded={open}
				on:click={() => {
					open = !open;
				}}
			>
				<svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
					{#if open}
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					{:else}
						<path
							fill-rule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
							clip-rule="evenodd"
						/>
					{/if}
				</svg>
			</button>
		</div>

		<ul class={`base-menu ${!open ? 'hidden' : ''}`}>
			<li>
				<a aria-current={$page.path === '/' ? 'page' : undefined} href="/">home</a>
			</li>
		</ul>

		<ul class={`util-menu ${!open ? 'hidden' : ''}`}>
			{#if hasUser}
				<li>
					<a aria-current={$page.path === '/forms' ? 'page' : undefined} href="/forms">forms</a>
				</li>

				<li>
					<a href="/logout" on:click|preventDefault={commit}>logout</a>
				</li>
			{:else}
				<li>
					<a aria-current={$page.path === '/register' ? 'page' : undefined} href="/register"
						>register
					</a>
				</li>

				<li>
					<a aria-current={$page.path === '/login' ? 'page' : undefined} href="/login">login</a>
				</li>
				<li />
			{/if}
		</ul>
	</div>
</nav>

<style style lang="postcss">
	.wrapper {
		@apply flex flex-col w-full mx-auto max-w-screen-2xl md:items-center md:justify-between md:flex-row;
	}

	.mobile-wrapper {
		@apply flex flex-row w-full md:w-1/6 items-center justify-between p-4 md:py-7;
	}

	.logo {
		@apply text-lg font-semibold tracking-widest text-cerulean-500 uppercase focus:outline-none;
	}

	nav {
		@apply font-light px-2 border-b border-cerulean-500;
	}

	button {
		@apply rounded-lg md:hidden focus:outline-none;
	}

	.base-menu {
		@apply flex-col flex-grow px-4 py-3 md:py-7 md:justify-start md:flex-row md:flex text-black;
	}

	.util-menu {
		@apply flex-col flex-grow px-4 py-3 md:py-7 md:justify-end md:flex-row md:flex text-black;
	}

	[aria-current] {
		@apply relative inline-block;
	}

	[aria-current]::after {
		@apply bg-cerulean-500 absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		display: block;
		bottom: -1px;
	}

	a {
		@apply block;
		padding: 1rem 0.5rem;
		text-decoration: none;
	}
</style>
