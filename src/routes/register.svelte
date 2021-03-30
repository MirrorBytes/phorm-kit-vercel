<script lang="ts">
	import { get } from 'svelte/store';

	import { FieldType } from 'svelte-multi';
	import type { SubmitType } from 'svelte-multi';

	import { goto } from '$app/navigation';

	import { authTrigger } from '../stores';
	import type Register from '../entities/validators/register';

	import { success, danger } from '$lib/notifier';

	import Form from '$lib/validate/Form.svelte';
	import Field from '$lib/validate/Field.svelte';

	const constraints = {
		email: {
			presence: true,
			email: true
		},
		name: {
			presence: true
		},
		password: {
			presence: true,
			length: {
				minimum: 5
			}
		},
		confirmPassword: {
			presence: true,
			equality: {
				attribute: 'password',
				message: '^The passwords does not match'
			}
		}
	};

	type Mutation = {
		register: {
			ok: boolean;

			msg: string;
		};
	};

	const submit = async (e: CustomEvent<SubmitType>) => {
		const { store } = e.detail;

		const response = await fetch('/graphql', {
			body: JSON.stringify({
				query: `mutation RegisterUser($data: Register!) {
					register(data: $data) {
						ok
						msg
					}
				}`,
				variables: {
					data: (get(store) as unknown) as Register
				}
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});

		const {
			data
		}: {
			data?: Mutation;
			// errors?: Array<{ message: string }>
		} = await response.json();

		if (data) {
			if (data.register.ok) {
				success(data.register.msg);

				authTrigger.update((v) => !v);

				goto('/');
			} else {
				danger(data.register.msg);
			}
		} // TODO: Check errors.
	};
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<div class="wrapper">
	<div class="inner">
		<div class="form-wrapper">
			<h1>Register</h1>

			<Form let:store let:errors let:validate {constraints} on:submit={submit} class="w-96">
				<Field
					{store}
					{errors}
					{validate}
					field={{
						id: 'email',
						name: 'email',
						type: FieldType.Email,
						placeholder: 'Email',
						label: { text: 'Email' }
					}}
					wrapperClass="flex flex-col"
				/>

				<Field
					{store}
					{errors}
					{validate}
					field={{
						id: 'name',
						name: 'name',
						type: FieldType.Text,
						placeholder: 'Name',
						label: { text: 'Name' }
					}}
					wrapperClass="flex flex-col"
				/>

				<Field
					{store}
					{errors}
					{validate}
					field={{
						id: 'password',
						name: 'password',
						type: FieldType.Password,
						placeholder: 'Password',
						label: { text: 'Password' }
					}}
					wrapperClass="flex flex-col"
				/>

				<Field
					{store}
					{errors}
					{validate}
					field={{
						id: 'confirmPassword',
						name: 'confirmPassword',
						type: FieldType.Password,
						placeholder: 'Confirm Password',
						label: { text: 'Confirm Password' }
					}}
					wrapperClass="flex flex-col"
				/>

				<div class="buttons">
					<a href="/login">Login</a>

					<input type="submit" value="Register" />
				</div>
			</Form>
		</div>
	</div>
</div>

<style style lang="postcss">
	.wrapper {
		@apply mx-auto p-4 w-full flex max-w-screen-2xl;
	}

	.inner {
		@apply flex-1 flex justify-center;
	}

	.form-wrapper {
		@apply my-4 prose lg:prose-xl;
	}

	.buttons {
		@apply mt-4 flex justify-end;
	}

	a {
		@apply px-2 py-1 text-cerulean-600;
	}

	[type='submit'] {
		@apply ml-2 px-2 py-1 text-white bg-cerulean-600;
	}

	h1 {
		@apply text-center uppercase tracking-wider;
		font-size: 2.1em;
		font-weight: 500 !important;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 3em;
		}
	}
</style>
