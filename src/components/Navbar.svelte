<script>
</script>

<style>
  header {
    width: 100vw;
    position: fixed;
    top: 0;
    background: #20447d;
    color: white;
  }

  ul > li:first-child {
    font-family: "Molengo", sans-serif;
  }

  ul {
    list-style-type: none;
    width: 70vw;
    min-height: 50px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 0;
  }

  ul li {
    align-self: center;
    height: 100%;
    cursor: pointer;
  }

  ul li:last-child {
    position: relative;
    display: flex;
    align-items: center;
  }

  @media screen and (max-width: 1600px) {
    ul {
      width: 80vw;
    }
  }

  @media screen and (max-width: 1400px) {
    ul {
      width: 90vw;
    }
  }
</style>

<header>
  <ul>
    <li >Scraping Products</li>
  </ul>
</header>
