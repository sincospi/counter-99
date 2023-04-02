import { writable } from 'svelte/store';

function initializeAppState() {
  const { subscribe, set, update } = writable({
    session: null,
  });

  return {
    subscribe,
    updateSession: (/** @type {String} */ x) => update((y) => ({ session: x })),
    resetSession: () => set({ session: null }),
  };
}

export const appState = initializeAppState();
