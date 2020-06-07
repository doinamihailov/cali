<template>
  <header>
    <router-link class="btn-header" to="/">
    <b-icon-house-door></b-icon-house-door>
    </router-link>
    <div class="center">
    <b-icon-eye></b-icon-eye>
    <span class="title"> Cali</span>
    </div>
    <router-link to="/about">
        <div class="info">
        <b-icon-info-circle></b-icon-info-circle>
        </div>
    </router-link>
  </header>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    user: Object
  }
}
</script>

<style lang="scss" scoped>
  header {
    box-sizing: border-box;
    background-color: #b403fa;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0;
    padding: 1rem;
    margin-top: -10px;
    margin-right: -10px;
    margin-left: -10px;
    height: 80px;


    .center {
        align-self: center;
        margin-left: auto;
        margin-right: auto;
        font-size: 1.7rem;
    }
    span {
        color: #e3b9e7;
        font-weight: bold;
        font-style: italic;
        }

  }
  .btn-header{
    font-size:1.7em;  
    border: none;
    border-radius: 3px;
    color: rgb(3, 3, 3);
    cursor: pointer;
    font-style: italic;
    padding: 0.5rem;
    margin: 0 0.5rem
  }
  .info {
    font-size:1em;  
    border: none;
    border-radius: 3px;
    color: rgb(3, 3, 3);
    cursor: pointer;
    font-style: italic;
    padding: 0.5rem;
    margin-top: 8px;
  }

</style>
