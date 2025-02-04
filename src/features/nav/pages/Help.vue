<template>
  <v-container>
    <v-row justify="space-around" dense>
      <v-col cols="auto">
        <cc-button
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions"
          color="secondary">
          Frequently Asked Questions
        </cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-button
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki/FAQ%3A-Troubleshooting"
          color="secondary">
          Troubleshooting FAQ
        </cc-button>
      </v-col>
    </v-row>
    <v-row justify="space-around" dense class="mb-4">
      <v-col cols="auto">
        <cc-button
          target="_blank"
          href="https://github.com/massif-press/compcon/issues/new/choose"
          color="primary">
          Report a Bug
        </cc-button>
      </v-col>

      <v-col cols="auto">
        <cc-button
          target="_blank"
          href="https://github.com/massif-press/compcon/issues/new/choose"
          color="primary">
          Suggest a Feature
        </cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-button
          target="_blank"
          href="https://github.com/massif-press/compcon/discussions"
          color="primary"
          class="text-white">
          Discussion Forum
        </cc-button>
      </v-col>
      <v-col cols="auto">
        <cc-button
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki"
          color="primary"
          class="text-white">
          Project Wiki
        </cc-button>
      </v-col>
    </v-row>
    <!-- <h3 class="heading text-accent">Tutorial Mode</h3>
    <p class="panel py-3 text-center text-disabled">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
    <cc-heading title text="Quick FAQ" />
    <v-row class="body-text text-text">
      <v-col cols="12" md="6">
        <cc-panel title="Where are the NPCs?">
          If you bought the LANCER Core Book, you'll find a downloadable data package that contains
          all Core NPC data on the LANCER Core Book's itch.io page, which you can access through the
          Content Manager. You can use the Content Manager's
          <b>Install LCP</b>
          tab to import the package and start building and running encounters.
        </cc-panel>
      </v-col>
      <v-col cols="12" md="6">
        <cc-panel title="How do I add content from Lancer expansions to COMP/CON?">
          Official LANCER content can be found on
          <a target="_blank" href="https://massif-press.itch.io/">Massif Press's itch.io page.</a>
          Player-facing LCP content for COMP/CON can be found in the
          <b>Download demo</b>
          section for any Massif Press publication; GM-facing content (i.e. NPCs) can be purchased
          alongside the PDF content. Links to this content (and featured community content) can also
          be found in the Content Manager's
          <b>LCP Directory</b>
          .
        </cc-panel>
      </v-col>
    </v-row>
    <v-row class="body-text text-text">
      <v-col cols="12" md="6">
        <cc-panel title="How do I see Exotic Items in the Compendium?">
          To prevent spoilers for players, COMP/CON defaults to hiding Exotic Items. To change their
          visibility, you can use COMP/CON's
          <b>Options</b>
          menu, and can enable the
          <b>"Show Exotic items in the Compendium"</b>
          toggle.
        </cc-panel>
      </v-col>
      <v-col cols="12" md="6">
        <cc-panel title="Do I need to pay to make a COMP/CON cloud account?">
          COMP/CON Cloud Accounts are free for all users. For Patreon supporters, cloud accounts
          gain access to additional features, such as the expanded cloud storage and additional
          active table instances.
        </cc-panel>
      </v-col>
    </v-row>
    <br />
    <cc-heading title text="Additional Help" />
    <p class="body-text">
      The
      <a
        target="_blank"
        href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions"
        v-html="`COMP/CON FAQ`"
        tabindex="0" />
      may have an answer to your question! If you still can't find what you're looking for, please
      stop by
      <a
        target="_blank"
        href="https://discord.gg/rwcpzsU"
        v-html="`the unofficial LANCER discord`"
        tabindex="0" />
      (and specifically the #comp-con channel) with your questions or comments for the developers.
    </p>

    <!-- <h3 class="heading text-accent">Video Guide</h3>
    <p class="panel py-3 text-center text-disabled">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'help-page',
  computed: {
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>
