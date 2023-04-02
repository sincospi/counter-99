<script>
  import { Navigate } from 'svelte-router-spa'
  export let currentRoute
  export const params = {}
  console.log({ currentRoute, params })

  import { onMount, onDestroy } from 'svelte';
  import { initialSessionData, subscribeSessionData } from '../firebase';

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
</script>

<div>
  <p class="">
    <Navigate to={['edit', currentRoute.namedParams.id].join('/')}>Edit</Navigate>
  </p>

  <h1>Session {currentRoute.namedParams.id}</h1>


  <ul>
  {#each sessionData.players as name, i}
    <li>
      {name}: {sessionData.playerScores[name]}
    </li>
  {/each} 
  </ul>

  

  
</div>