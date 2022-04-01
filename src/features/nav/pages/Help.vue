<template>
  <div>
    <v-row class="my-2" justify="center">
      <v-col cols="8">
        <v-btn
          target="_blank"
          href="https://forms.gle/pj6o8BzxCe4xGQ5M7"
          x-large
          block
          color="secondary"
          class="white--text"
        >
          request a feature / report a bug
        </v-btn>
      </v-col>
    </v-row>
    <h3 class="heading accent--text">Tutorial Mode</h3>
    <p class="panel py-3 text-center subtle--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p>
    <h3 class="heading accent--text">FAQ</h3>
    <div class="body-text text--text">
      <b>
        Where are the NPCs?
      </b>
      <p>
        Now that LANCER is offically released, COMP/CON mirrors the Core Book structure in terms of
        paid/free content. If you bought the LANCER Core Book, you'll find a downloadble data
        package that contains all Core NPC data on the LANCER Core Book's itch.io page, which you
        can access by going to the Content Manager in the main page or in the nav bar options menu
        and selecting the Core Book item from the LCP Directory tab. You can use the Content
        Manager's Install LCP tab to import the package and start building and running encounters.
      </p>
      <b>I see a Roll20 import function, how do I use it?</b>
      <p>
        The importer on Roll20's side is not available yet.
      </p>
    </div>

    <h3 class="heading accent--text">Additional Help</h3>
    <p class="body-text">
      The <a target="_blank" href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions" v-html="`COMP/CON FAQ`" /> 
      may have an answer to your question! If you still can't find what you're looking for, please stop by
      <a target="_blank" href="https://discord.gg/rwcpzsU" v-html="`the unofficial LANCER discord`" />
      (and specifically the #comp-con channel) with your questions or comments for the developers.
    </p>

    <h3 class="heading accent--text">Video Guide</h3>
    <p class="panel py-3 text-center subtle--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'help-page',
})
</script>
