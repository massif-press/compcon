<template>
  <div id="wrapper">
    <h1>title</h1>
    <h3>subtitle</h3>
    <b-container>
      <b-row>
        <b-col><router-link to="/roster" tag="b-button">users</router-link></b-col>
        <b-col><router-link to="/mods" tag="b-button" disabled>editor</router-link></b-col>
        <b-col><router-link to="/gm" tag="b-button" disabled>tools</router-link></b-col>
      </b-row>
    </b-container>
    <footer>
      version -- links -- etc
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'landing-page'
  }
</script>

<style scoped>


  #wrapper {
    width: 100%;
    height: 100vh;

    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
  }
</style>
