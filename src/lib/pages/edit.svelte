<script>
  import { Navigate } from "svelte-router-spa";

  export let currentRoute;
  export const params = {};
  console.log({ currentRoute, params });

  import { onMount, onDestroy } from "svelte";
  import {
    initialSessionData,
    subscribeSessionData,
    appendToPlayerScore,
    removeFromPlayerScore,
    resetAllPlayerScores,
  } from "../firebase/firestore";

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
    unsubscribeSessionData = subscribeSessionData(
      currentRoute.namedParams.id,
      refreshSessionData
    );
  });

  onDestroy(() => {
    if (unsubscribeSessionData != null) {
      console.log(`UNSUBSCRIBE from session ${currentRoute.namedParams.id}`);
      unsubscribeSessionData();
      unsubscribeSessionData = null;
    }
  });

  function addAward(name) {
    appendToPlayerScore(currentRoute.namedParams.id, name, 1);
  }

  function removeAward(name, createdAt) {
    removeFromPlayerScore(currentRoute.namedParams.id, name, createdAt);
  }

  function resetAllScores() {
    confirm("Are you sure you want to reset all player scores?") && resetAllPlayerScores(currentRoute.namedParams.id);
  }

  let columnWidthMultiplier = 0.1;
  $: columnWidthMultiplier = sessionData.players.length
    ? 1 / sessionData.players.length
    : 0.1;
  $: console.log({ columnWidthMultiplier });

  let lastAwardedPlayer;
  $: lastAwardedPlayer = sessionData.awards.length
    ? sessionData.awards[sessionData.awards.length - 1]["player"]
    : null;
  $: console.log({ lastAwardedPlayer });

  let leadScore;
  $: leadScore = Object.values(sessionData.playerScores).reduce(
    (accumulator, currentValue) => Math.max(accumulator, currentValue),
    0
  );
  $: console.log({ leadScore });
</script>

<div class="page">
  <div class="header">
    {sessionData.createdAt
      ? sessionData.createdAt.toISOString().slice(0, 19)
      : "Loading..."}
  </div>

  <div class="score-board">
    {#each sessionData.players as name, i}
      <div class="score-board-card">
        <button on:click={() => addAward(name)}>
          <div
            class="player-name{leadScore == sessionData.playerScores[name]
              ? ' red'
              : ''}"
            style="--column-width-multiplier:{columnWidthMultiplier}"
          >
            {name}
          </div>
          <div
            class="player-score"
            style="--column-width-multiplier:{columnWidthMultiplier}"
          >
            {sessionData.playerScores[name]}
            {#if lastAwardedPlayer == name}
              <span style="color: red">.</span>
            {/if}
          </div>
        </button>
      </div>
    {/each}
  </div>

  <table class="awards">
    {#each sessionData.awards.slice(-10).reverse() as award, i}
      <tr class="award">
        <td class="created-at"
          >{isNaN(award.created_at)
            ? null
            : award.created_at.toDate().toISOString().slice(0, 19)}</td
        >
        <td class="player{lastAwardedPlayer == award.player ? ' red' : ''}"
          >{award.player}</td
        >
        <td class="action">
          <button on:click={() => removeAward(award.player, award.created_at)}
            >X</button
          >
        </td>
      </tr>
    {/each}
  </table>
  {#if sessionData.awards.length > 10}
    <p class="more-awards">Additional scores exists (Only last 10 shown)</p>
  {/if}
  {#if sessionData.awards.length > 0}
    <p class="all-player-score-reset">
      Reset all player scores: <button on:click={resetAllScores}>Reset</button>
    </p>
  {/if}

  <div class="footer">
    <Navigate to={"/"}>List</Navigate>
    <Navigate to={["show", currentRoute.namedParams.id].join("/")}
      >Show</Navigate
    >
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
  button {
    border: none;
    background-color: transparent;
    padding: 0;
  }
</style>
