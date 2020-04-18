<template>
  <div>
    <v-row>
      <v-col>
        <v-btn v-extlink="'https://forms.gle/rb3ZBFYbZ6kFWhBz7'" large block color="error">
          report a bug
        </v-btn>
      </v-col>
      <v-col cols="1" />
      <v-col>
        <v-btn v-extlink="'https://forms.gle/Gxsu3vaPX1Zs9CX29'" large block color="secondary">
          request a feature
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
        What happened to the NPCs?
      </b>
      <p>
        Now that LANCER is offically released, COMP/CON mirrors the Core Book structure in terms of
        paid/free content. If you bought the LANCER Core Book, you'll find a downloadble data
        package that contains all Core NPC data. You can use the Content Manager button on the main
        page or in the nav bar options menu to import the package and start building and running
        encounters.
      </p>
      <b>
        My COMP/CON Pilot I made in v.1.x isn't working correctly, or at all
      </b>
      <p>
        Unfortunately, v2 was a breaking change. The Options menu will allow you to save old pilot
        data to disk as we work on a (probably somwhat limited) converter. Sorry for the
        inconvienience, and I think this'll probably be the only time we'll have a big breaking
        change like this
      </p>
      <b>Will COMP/CON get [feature]?</b>
      <p>
        You can check out what's next for COMP/CON on our
        <a
          v-extlink="
            'https://github.com/massif-press/compcon/issues?q=is%3Aopen+is%3Aissue+label%3Afeature'
          "
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
      <b>
        Where are the Long Rim mechs?
      </b>
      <p>
        Long Rim/Wallflower/etc content will be released as soon as we finish porting them to C/C v2
        and will be released as packages on Massif's itch.io page.
      </p>
      <b>
        Will we be able to add our own Frames, Equipment, or other game data?
      </b>
      <p>
        Homebrew content is a major incoming feature that we'll start work on shortly. Stop by the
        Discord and join the `comp-con club` role if you want to stay updated. When it releases,
        we'll make a major update announcement on itch and twitter.
      </p>
    </div>

    <h3 class="heading accent--text">Additional Help</h3>
    <p class="body-text">
      We're currently working on more help resources for COMP/CON, especially for new players and
      GMs. In ththe meantime, please stop by
      <a
        v-extlink="`https://discord.gg/rwcpzsU`"
        href="https://discord.gg/rwcpzsU"
        v-html="`the LANCER discord`"
      />
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
