<script>
  import { Navigate } from 'svelte-router-spa'
  export let currentRoute
  export const params = {}
  console.log({ currentRoute, params })

  import { onMount, onDestroy } from 'svelte';
  import { initialSessionData, subscribeSessionData } from '../firebase/firestore';

  const sessionData = { ...initialSessionData };
  let unsubscribeSessionData;

  function refreshSessionData(doc) {
    sessionData.players = [...doc.players];
    sessionData.createdAt = doc.created_at.toDate();
    sessionData.awards = doc.awards.map((a) => ({ ...a }));
    sessionData.players.forEach((name) => {
      sessionData.playerScores[name] = sessionData.awards.filter(
        (award) => award.player == name
      ).length; //reduce((accumulator, award) => accumulator + award.value, 0)
    });
    console.log({ sessionData });
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

  let columnWidthMultiplier = 0.1;
  $: columnWidthMultiplier = sessionData.players.length ? (1 / sessionData.players.length) : 0.1;
  $: console.log({ columnWidthMultiplier });

  let lastAwardedPlayer;
  $: lastAwardedPlayer = sessionData.awards.length ? sessionData.awards[sessionData.awards.length-1]['player'] : null;
  $: console.log({ lastAwardedPlayer });

  let leadScore;
  $: leadScore = Object.values(sessionData.playerScores).reduce((accumulator, currentValue) => Math.max(accumulator, currentValue), 0)
  $: console.log({ leadScore });
</script>



<div class="page">
  <div class="score-board">
    {#each sessionData.players as name, i}
    <div class="score-board-card">
        <div class="player-name{leadScore == sessionData.playerScores[name] ? ' red' : ''}" style="--column-width-multiplier:{columnWidthMultiplier}">
          {name}
        </div>
        <div class="player-score" style="--column-width-multiplier:{columnWidthMultiplier}">
          {sessionData.playerScores[name]}
          {#if lastAwardedPlayer == name }
            <span style="color: red">.</span>
          {/if}
        </div>
    </div>
    {/each}
  </div>
  
  <div class="footer">
    <Navigate to={'/'}>List</Navigate>
    <Navigate to={['edit', currentRoute.namedParams.id].join('/')}>Edit</Navigate>
  </div>
</div>
<style>
	.player-name {
    /* background-color: #ffffff; */
		/* color: purple; */
    border-width: 1px 1px 0;
    border-style: solid;
    /* width: calc(90vw * var(--column-width-multiplier));
    font-size: calc(20vw * var(--column-width-multiplier)); */
    width: calc(25vw);
    font-size: calc(5vw);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
	}
  .player-score {
    /* background-color: #f060ff; */
    border-width: 0 1px 1px;
    border-style: solid;
    /* width: calc(90vw * var(--column-width-multiplier));
    font-size: calc(60vw * var(--column-width-multiplier)); */
    width: calc(25vw);
    font-size: calc(10vw);
    text-align: center;
    line-height: calc(60vw * var(--column-width-multiplier));
  }
  .red {
    background-color: red;
  }
</style>