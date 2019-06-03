<template>
  <div id="wrapper">
    <v-container fluid>
      <v-layout>
        <v-flex>
          <h1 class="display-3">COMP/CON</h1>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <h3 class="display-1 grey--text">&emsp; A digital toolset for the LANCER TTRPG</h3>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <v-layout style="height: 100%" align-v="center" class="mt-5">
        <v-flex>
          <v-btn block color="primary" large to="/pilot_management">Pilot Roster</v-btn>
        </v-flex>
        <v-flex>
          <v-btn block color="primary" large to="/compendium">COMPENDIUM</v-btn>
        </v-flex>
        <v-flex>
          <v-tooltip bottom>
            <v-btn slot="activator" block large :to="'/gm'" disabled>GM Toolkit</v-btn>
            <span>WIP</span>
          </v-tooltip>
        </v-flex>
        <v-flex>
          <v-btn slot="activator" block large :to="'/mods'" disabled>Homebrew Editor</v-btn>
        </v-flex>
      </v-layout>

      <v-divider/>
      <v-layout>
        <v-flex>
          <v-card>
            <v-card-title class="title">
              Updated June 2nd, 2019
              <span class="caption">(v1.3.1)</span>
            </v-card-title>
            <v-card-text>
              SECRET DISCORD RELEASE III:<br>
              Third time's the charm?
              Thanks for all your help. Seriously.
              <br><br>
              KNOWN ISSUES:<br>
              - pilot and mech loadouts may still be buggy, especially on delete<br>
              - the pilot data structure has changed. C/C will try to convert old pilots, but may miss some stuff. Check your loadouts before playing.<br>
              - some of the UI is still a little janky<br>
              - damage/range sorting only keys off of first/primary damage<br>
              - mod SP not automatically updating in view (correctly determined when assigning other mods/systems)<br>
              - integrated weapon's is not correctly saving it's loaded weapon<br>
              <br><br>
              ~ bless this mess ~
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- <v-footer fixed>
      <span href="#">&emsp;v. {{ ver }}</span>
      <v-spacer/>
      <v-btn flat small disabled>About</v-btn>
      <v-btn flat small disabled>Help</v-btn>
      <v-btn color="warning" small disabled>Support This Project</v-btn>
    </v-footer> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "landing-page",
  data: () => ({
    ver: "0"
  }),
  created: function() {
    const packageVersion = process.env.npm_package_version;
    if (packageVersion) this.ver = packageVersion;
  }
});
</script>

<style scoped>
#wrapper {
  width: 100%;
  height: 100vh;

  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
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
  background: rgba(0, 0, 0, 0);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}
</style>