<template>
    <div id="wrapper">
    <v-container fluid>
      <v-layout>
        <v-flex>
          <h1 class="display-4">title</h1>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <h3 class="display-2">subtitle</h3>
        </v-flex>
      </v-layout>
    </v-container>

    <div style="padding-top:1vh;" />

    <v-container>
      <v-layout style="height: 100%" align-v="center">
        <v-flex><v-btn block large to="/roster">users</v-btn></v-flex>
        <v-flex><v-btn block large :to="'/mods'" disabled>editor</v-btn></v-flex>
        <v-flex><v-btn block large :to="'/gm'" disabled>tools</v-btn></v-flex>
      </v-layout>

      <v-layout style="padding-top:10vh">
        <v-flex>
            <b-card header="Update" title="MM/DD/YYYY" sub-title="v.x.x.x">
              <b-card-body>notes, links, etc</b-card-body>
            </b-card>
          </v-flex>
      </v-layout>

      <br>

      <v-layout>
        <v-flex>
          <b-card no-body class="text-center">
            <span class="text-muted">loading log</span>
          </b-card>
        </v-flex>
      </v-layout>
    </v-container>


    <v-footer fixed>
      <span href="#">ver. {{version}}</span>
      <v-spacer />
      <v-btn flat small>About</v-btn>
      <v-btn flat small>Help</v-btn>
    </v-footer>
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
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(0,0,0,0) 
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}


</style>