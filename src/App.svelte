<script>
	import { Router, Route } from "svelte-routing";
  import axios from 'axios';
  import Card from './components/Card.svelte'
  import Navbar from './components/Navbar.svelte';
  import { Circle3 } from 'svelte-loading-spinners'
  let search='';
  let clicked=false;
  let promise;
  const loadItems = async (search) => {
    search.replace(/ /g, '%20');
    const response = await axios.get(`http://localhost:3000/search?query=${search}`)
    if (response.status === 200) {
      console.log(response.data);
      clicked = true;
      return response;
    } else {
      throw new Error(response.statusText);
    }
  }
  const handleClick = (Search) => {
    promise = loadItems(search);
  }
</script>
<Navbar />
<div class="flex justify-center pt-16">
    <input class="border rounded-lg border-solid border-black " type="text" name="search" id="search" bind:value={search}>
    <div class="pl-10">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" on:click="{handleClick(search)}">Search</button></div>
</div>
{#await promise}
  <div class="flex justify-center pt-10">
  <Circle3 size="60" unit="px" />
  </div>
{:then items}
  <section class="card-wrapper grid">
  {#if clicked}
  {#each items.data as item}
    <Card {item} />
  {/each}
  {/if}
</section>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .grid {
    width: 70vw;
    margin: 10vh auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    justify-items: stretch;
  }

  @media screen and (max-width: 1600px) {
    .grid {
      width: 80vw;
    }
  }

  @media screen and (max-width: 1400px) {
    .grid {
      width: 90vw;
    }
  }

  @media screen and (max-width: 1200px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 800px) {
    .grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }
</style>
