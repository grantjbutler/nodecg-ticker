import { ref, isRef, computed, Ref } from 'vue'
import clone from 'clone'

interface ReplicantOptions<T> {
  persistent?: boolean
  defaultValue: T,
  namespace?: string,
}

export function useReplicant<T>(name: string, opts: ReplicantOptions<T>) {
	if (isRef(name)) {
		console.warn(`Tried to create a replicant using a reactive name (${name.value})`)

        return computed(() => opts.defaultValue);
	}

    let rep = opts.namespace ? nodecg.Replicant<T>(name, opts.namespace, opts) : nodecg.Replicant<T>(name, opts)

    const value = ref(opts.defaultValue) as Ref<T>;

    rep.on('change', newValue => {
        value.value = clone(newValue || opts.defaultValue);
    })

    return computed(() => value.value);
}