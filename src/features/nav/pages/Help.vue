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
      <b>Will COMP/CON get [feature]?</b>
      <p>
        You can check out what's next for COMP/CON on our
        <a
          target="_blank"
          href="https://github.com/massif-press/compcon/issues?q=is%3Aopen+is%3Aissue+label%3Afeature"
          v-html="'GitHub issue tracker'"
        />
        . If you don't see the feature you're interested in, you can suggest it by clicking the
        "Request a Feature" button above.
      </p>
      <b>Is COMP/CON available on mobile devices?</b>
      <p>
        That's something we're working on currently. Although it's largely untested, you should be
        able to use compcon.app in landscape mode on most modern tablets. Expect a more robust
        tablet mode -- as well as a phone mode -- in the future. Also, COMP/CON can be saved as a
        Progressive Web App to most mobile devices.
      </p>
      <b>Is there any way to get the Wallflower/KTB/other preview mechs in COMP/CON?</b>
      <p>
        Additional content, such as the Wallflower previews are available in the pins of the
        #comp-con channel of the LANCER Discord. These will be officially released along with their
        respective books, and downloadable through the LCP Directory.
      </p>
      <b>I see a Roll20 import function, how do I use it?</b>
      <p>
        The importer on Roll20's side is not available yet.
      </p>
    </div>

    <h3 class="heading accent--text">Additional Help</h3>
    <p class="body-text">
      We're currently working on more help resources for COMP/CON, especially for new players and
      GMs. In the meantime, please stop by
      <a target="_blank" href="https://discord.gg/rwcpzsU" v-html="`the LANCER discord`" />
      (and specifically the #comp-con channel) if you have a question or comment for the developers.
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
