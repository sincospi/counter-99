<script>
  import {
  getFirestore,
  addDoc,
  collection,
} from 'firebase/firestore';
  
  import { Navigate, navigateTo } from 'svelte-router-spa'
  export let currentRoute
  export const params = {}
  console.log(currentRoute,params)

  import { appState } from '../stores.js'

  async function createNewSession(playerNamesArr) {
    const db = getFirestore();
    let docRef;
    const session = {
      created_at: new Date(),
      players: playerNamesArr,
      awards: [],
    }
    console.log({ session })
    try {
      docRef = await addDoc(collection(db, 'sessions'), session);
      console.log('Session document added with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.error('Error adding session document: ', e);
      return null;
    }
  }

  async function handleSubmit(e) {
    let playerNames = e.target.elements.player_names.value;
    console.log({ playerNames });
    if (playerNames) {
      playerNames = playerNames.split(',').map(x => x.trim()).filter(x => typeof x === 'string' && x.trim().length > 0);
      const session = await createNewSession(playerNames);
      if (session) {
        e.target.elements.player_names.value = '';
        appState.updateSession(session);
        navigateTo(['show', $appState.session].join('/'));
      }
    }
  }
</script>

<div>
  <h1>New session</h1>

  <form on:submit|preventDefault={handleSubmit} class="">
    <label for="player_names" class="text">
      Player names:
      <input name="player_names" type="text" placeholder="Name1, Name2, ...">
    </label>

    <button type="submit" class="">Submit</button>
  </form>
</div>
