<script>
	import { Router, Route } from "svelte-routing";
  import NavLink from "./components/NavLink.svelte";
  import axios from 'axios';
  const onSearch = (search) => {
    axios.get(`http://localhost:3000/search?query=${search}`)
        .then(res => {
          products = res.data;
          console.log(products);
          clicked=true;
          console.log(products.title);
        })
  }
  let search='';
  let products = {};
  let clicked=false;
</script>
<h1 class="flex justify-center pt-3">Scrapping Products</h1>
<div class="flex justify-center pt-5 container">
    <input class="" type="text" name="search" id="search" bind:value={search}>
    <button on:click="{onSearch(search)}">Search</button>
</div>
{#if clicked}
{#each products as product}
<div class="flex justify-center pt-5 rounded-t-sm border-black">
    <div class="container p-2">
        <p class="pt-5">{product.amazon.title}</p>
        <div>
            <img class="pt-6" src="{product.amazon.thumbnail}" alt="sdadsa" width="200" height="300">
        </div>
    <p class="pt-3 pl-4">Amazon's Price: {product.amazon.price}</p> {#if product.flipkart.price} <p class="pt-3">Flipkart's Price: {product.flipkart.price}</p> {/if}
    <br />
    <a href="{product.amazon.url}" target="_blank"><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Product on Amazon</button></a> 
    {#if product.flipkart.price}<a href="{product.flipkart.flink}" target="_blank"><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Product on Flipkart</button></a>
    {:else}<button class="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
        not available in flipkart
      </button>
    {/if}
    </div>
</div>
{/each}
{/if}

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
