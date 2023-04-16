<script>
  import { Navigate } from 'svelte-router-spa'

  export let currentRoute
  export const params = {}
  console.log(currentRoute,params)

  import { onMount, onDestroy } from 'svelte';
  import { subscribeSessionsList, createNewSession } from '../firebase/firestore';
  import Login from './login.svelte';


  let sessionsList = [];

  function refreshSessionsList(list) {
    sessionsList = list;
    console.log({ sessionsList });
  }

  let unsubscribeSessionsList;
  onMount(async () => {
    console.log(`SUBSCRIBE to sessionsList`);
    unsubscribeSessionsList = subscribeSessionsList(refreshSessionsList);
  });

  onDestroy(() => {
    if (unsubscribeSessionsList != null) {
      console.log(`UNSUBSCRIBE from sessionsList`);
      unsubscribeSessionsList();
      unsubscribeSessionsList = null;
    }
	});

  async function handleSubmit(e) {
    let playerNames = e.target.elements.player_names.value;
    console.log({ playerNames });
    if (playerNames) {
      playerNames = playerNames.split(',').map(x => x.trim()).filter(x => typeof x === 'string' && x.trim().length > 0);
      const session = await createNewSession(playerNames);
      if (session) {
        e.target.elements.player_names.value = '';
        // appState.updateSession(session);
        // navigateTo(['show', $appState.session].join('/'));
      }
    }
  }
</script>


<!-- HTML -->
<div>
  <h1>Counter-99</h1>

  <Login />

  <h2>New session</h2>

  <form on:submit|preventDefault={handleSubmit} class="">
    <label for="player_names" class="text">
      Player names:
      <input name="player_names" type="text" placeholder="Name1, Name2, ...">
    </label>

    <button type="submit" class="">Submit</button>
  </form>

  <h2>All session</h2>

  <table>
    <tr>
      <th class="left">Created at</th>
      <th class="left">Created by</th>
      <th class="left">Players</th>
      <th class="right">Award count</th>
    </tr>
    {#each sessionsList as session, i}
    <tr>
      <td class="left">
        <Navigate to={['show', session.id].join('/')}>
          {session.created_at.toDate().toISOString().slice(0,19)}
        </Navigate>
      </td>
      <td class="left">{session.created_by.name}</td>
      <td class="left">{session.players.join(', ')}</td>
      <td class="right">{session.awards.length}</td>
    </tr>
    {/each}
  </table>
</div>



<style>
.right {
  text-align: right;
}
.left {
  text-align: left;
}
</style>