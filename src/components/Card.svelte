  <script>
  export let item;
  let { flipkart , amazon } = item;


  // const cartItems = get(cart);
  // let inCart = cartItems[name] ? cartItems[name].count : 0;

  // function addToCart() {
  //   inCart++;
  //   cart.update(n => {
  //     return { ...n, [name]: { ...item, count: inCart } };
  //   });
  // }
</script>

<style>
  .item-card {
    align-self: stretch;
    justify-self: stretch;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 300px 0.5fr 0.5fr;
    column-gap: 10px;
    padding: 2em;
    font-size: 15px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    grid-column: 1/4;
    grid-row: 1;
  }

  .title {
    align-self: center;
    font-size: 1.5em;
    grid-column: 1/3;
    grid-row: 2;
  }

  .price {
    grid-column: 3;
    grid-row: 2;
    font-size: 1.1em;
    justify-self: end;
    align-self: center;
  }

  .price {
    grid-column: 3;
    grid-row: 3;
    font-size: 1.1em;
    justify-self: end;
    align-self: center;
  }
</style>

<div class="item-card">
  <img class="cover" src={amazon[0].thumbnail} alt={amazon[0].title} />
  <h3 class="title">{flipkart.title}</h3>
  <p class="price">Flipkart Price: {flipkart.price}</p>
  <p class="price1">Amazon Price: ₹ {amazon[0].price} </p>
  <a  href={amazon[0].url} target="_blank"><button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Amazon</button></a>
  <a href={flipkart.url} target="_blank"><button class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Flipkart</button></a>
</div>
