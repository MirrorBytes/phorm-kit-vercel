<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { validate } from 'validate.js';

	import Form from 'svelte-multi/runtime/wrappers/Form.svelte';
	import type { IndexableJsonValue, SubmitType } from 'svelte-multi';

	export let store: Writable<IndexableJsonValue> = writable({});
	export let constraints: Record<string, unknown>;

	const dispatch = createEventDispatcher();
	const errors: Writable<Record<string, string[]>> = writable({});

	store.subscribe((v) => {
		const keys = Object.keys(v);

		for (let x = 0; x < keys.length; x++) {
			errors.update((e) => {
				e[keys[x]] = [];

				return e;
			});
		}
	});

	const validateForm = () => {
		const gotten = get(store);
		const fields: Record<string, string> = {};

		const keys = Object.keys(constraints);

		for (let x = 0; x < keys.length; x++) {
			fields[keys[x]] = gotten[keys[x]] as string;
		}

		const validateErrors: Record<string, string[]> = validate(fields, constraints);

		if (validateErrors) {
			errors.update((v) => {
				const errorKeys = Object.keys(validateErrors);

				for (let x = 0; x < errorKeys.length; x++) {
					v[errorKeys[x]] = validateErrors[errorKeys[x]];
				}

				return v;
			});

			return false;
		}

		return true;
	};

	const validateSubmit = ({ e, store }: SubmitType) => {
		if (validateForm()) {
			dispatch('submit', { e, store });
		}
	};
</script>

<Form
	{store}
	let:multi
	let:prev
	let:next
	on:submit={(e) => validateSubmit({ ...e.detail })}
	{...$$restProps}
>
	<slot {store} validate={validateForm} {errors} {multi} {prev} {next} />

	<slot name="prev" slot="prev" />
	<slot name="next" slot="next" />
	<slot name="submit" slot="submit" />
</Form>
