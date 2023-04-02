<script>
  import { Navigate } from 'svelte-router-spa'
  
  export let currentRoute
  export const params = {}
  console.log({ currentRoute, params })

  import { onMount, onDestroy } from 'svelte';

  import {
    getFirestore,
    onSnapshot,
    doc,
    // setDoc,
  } from 'firebase/firestore';

  let sessionData = {
    players: [],
    createdAt: null,
    awards: [],
  };

  const db = getFirestore();
  const playerScores = {};

  let docSnapUnsubscribe;
  onMount(async () => {
    console.log(`SUBSCRIBE to docSnap ${currentRoute.namedParams.id}`);
    docSnapUnsubscribe = onSnapshot(doc(db, 'sessions', currentRoute.namedParams.id), (docSnap) => {
      if (docSnap.exists()) {
        console.log(`RECEIVED for docSnap ${currentRoute.namedParams.id}`);
        sessionData.players = [...docSnap.data().players];
        sessionData.createdAt = docSnap.data().created_at;
        sessionData.awards = docSnap.data().awards.map(a => ({ ...a }));
        console.log({ sessionData });
        sessionData.players.forEach(name => {
          playerScores[name] = sessionData.awards.filter(award => award.player == name).length; //reduce((accumulator, award) => accumulator + award.value, 0)
        });
        console.log({ playerScores });
      } else {
        console.log(`Document ${currentRoute.namedParams.id} not found`);
      }
    });
  });

  onDestroy(() => {
    if (docSnapUnsubscribe != null) {
      console.log(`UNSUBSCRIBE from docSnap ${currentRoute.namedParams.id}`);
      docSnapUnsubscribe();
      docSnapUnsubscribe = null;
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
      {name}: {playerScores[name]}
    </li>
	{/each} 
  </ul>
</div>