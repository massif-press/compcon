<template>
  <div id="wrapper">
    <b-container fluid>
      <b-row>
        <b-col>
          <h1 class="display-1">title</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h3>subtitle</h3>
        </b-col>
      </b-row>
    </b-container>

    <div style="padding-top:10vh;" />

    <b-container>
      <b-row style="height: 100%" align-v="center">
        <b-col><b-btn block size="lg" :to="'/roster'">users</b-btn></b-col>
        <b-col><b-btn block size="lg" :to="'/mods'" disabled>editor</b-btn></b-col>
        <b-col><b-btn block size="lg" :to="'/gm'" disabled>tools</b-btn></b-col>
      </b-row>

      <b-row style="padding-top:10vh">
        <b-col>
            <b-card header="Update" title="MM/DD/YYYY" sub-title="v.x.x.x">
              <b-card-body>notes, links, etc</b-card-body>
            </b-card>
          </b-col>
      </b-row>

      <br>

      <b-row>
        <b-col>
          <b-card no-body class="text-center">
            <span class="text-muted">loading log</span>
          </b-card>
        </b-col>
      </b-row>
    </b-container>


    <b-navbar toggleable="md" fixed="bottom">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-text href="#">ver. {{version}}</b-nav-text>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item right>About</b-nav-item>
          <b-nav-item right>Help</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
  export default {
    name: 'landing-page',
    computed: {
      version: function () {
        return this.versionNumber
      }
    }
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

<style>
body {
      overflow: hidden;
}
/* width */
::-webkit-scrollbar {
  /* width: 10px; */
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(0,0,0,0) 
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>