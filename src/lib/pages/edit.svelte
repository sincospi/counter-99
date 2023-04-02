<script>
  import { Navigate } from 'svelte-router-spa'
  
  export let currentRoute
  export const params = {}
  console.log({ currentRoute, params })

  import { onMount, onDestroy } from 'svelte';
  import { initialSessionData, subscribeSessionData, appendToPlayerScore } from '../firebase';

  const sessionData = { ...initialSessionData };
  let unsubscribeSessionData;

  function refreshSessionData(doc) {
    sessionData.players = [...doc.players];
    sessionData.createdAt = doc.created_at;
    sessionData.awards = doc.awards.map((a) => ({ ...a }));
    console.log({ sessionData });
    sessionData.players.forEach((name) => {
      sessionData.playerScores[name] = sessionData.awards.filter(
        (award) => award.player == name
      ).length; //reduce((accumulator, award) => accumulator + award.value, 0)
    });
    console.log({ playerScores: sessionData.playerScores });
  }


  onMount(async () => {
    console.log(`SUBSCRIBE to session ${currentRoute.namedParams.id}`);
    unsubscribeSessionData = subscribeSessionData(currentRoute.namedParams.id, refreshSessionData);
  });

  onDestroy(() => {
    if (unsubscribeSessionData != null) {
      console.log(`UNSUBSCRIBE from session ${currentRoute.namedParams.id}`);
      unsubscribeSessionData();
      unsubscribeSessionData = null;
    }
	});

  async function handleClick(name) {
    return appendToPlayerScore(currentRoute.namedParams.id, name, 1);
  }
</script>

<div>
  <p class="">
    <Navigate to={['show', currentRoute.namedParams.id].join('/')}>Show</Navigate>
  </p>
  <h1>Edit session {currentRoute.namedParams.id}</h1>


  <ul>
  {#each sessionData.players as name, i}
    <li>
      <button class="" on:click={handleClick(name)}>{name}</button> {sessionData.playerScores[name]}
    </li>
  {/each} 
  </ul>


</div>