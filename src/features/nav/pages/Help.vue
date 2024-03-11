<template>
  <div>
    <v-row class="my-2" justify="center">
      <v-col cols="4">
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions"
          x-large
          block
          color="secondary"
          class="white--text"
          tabindex="0"
        >
          Frequently Asked Questions
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki/Troubleshooting-Issues"
          x-large
          block
          color="secondary"
          class="white--text"
          tabindex="0"
        >
          Troubleshooting
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/issues/new/choose"
          x-large
          block
          color="error"
          class="white--text"
          tabindex="0"
        >
          Report a Bug / Suggest a Feature
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/discussions"
          x-large
          block
          color="error"
          class="white--text"
        >
          Discussion Forum
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki"
          x-large
          block
          color="error"
          class="white--text"
        >
          Project Wiki
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="text-center">
        Adding an issue directly to the GitHub repository is strongly encouraged to allow us to ask
        questions and for you to be able to track issue progress. However, if this isn't possible,
        the old bug reporting form (which does not require a GitHub account) can be found
        <a target="_blank" href="https://forms.gle/pj6o8BzxCe4xGQ5M7">here</a>
        .
      </v-col>
    </v-row>
    <!-- <h3 class="heading accent--text">Tutorial Mode</h3>
    <p class="panel py-3 text-center subtle--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
    <h3 class="heading accent--text mt-4">Quick FAQ</h3>
    <div class="body-text text--text">
      <b>Where are the NPCs?</b>
      <p>
        Now that LANCER is offically released, COMP/CON mirrors the Core Book structure in terms of
        paid/free content. If you bought the LANCER Core Book, you'll find a downloadable data
        package that contains all Core NPC data on the LANCER Core Book's itch.io page, which you
        can access by going to the Content Manager in the main page or in the nav bar options menu
        and selecting the Core Book item from the LCP Directory tab. You can use the Content
        Manager's Install LCP tab to import the package and start building and running encounters.
      </p>
      <b>Can I import my COMP/CON pilot to Roll20?</b>
      <p>Roll20 does not support imports from COMP/CON at this time.</p>
    </div>

    <h3 class="heading accent--text">Additional Help</h3>
    <p class="body-text">
      The
      <a
        target="_blank"
        href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions"
        v-html="`COMP/CON FAQ`"
        tabindex="0"
      />
      may have an answer to your question! If you still can't find what you're looking for, please
      stop by
      <a
        target="_blank"
        href="https://discord.gg/rwcpzsU"
        v-html="`the unofficial LANCER discord`"
        tabindex="0"
      />
      (and specifically the #comp-con channel) with your questions or comments for the developers.
    </p>

    <!-- <h3 class="heading accent--text">Video Guide</h3>
    <p class="panel py-3 text-center subtle--text">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'help-page',
})
</script>
