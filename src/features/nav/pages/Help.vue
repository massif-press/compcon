<template>
  <v-container>
    <v-row justify="space-around">
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions"
          size="large"
          variant="tonal"
          block
          color="secondary"
          class="text-white"
          tabindex="0"
        >
          Frequently Asked Questions
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki/FAQ%3A-Troubleshooting"
          size="large"
          variant="tonal"
          block
          color="secondary"
          class="text-white"
          tabindex="0"
        >
          Troubleshooting FAQ
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/issues/new/choose"
          size="large"
          variant="tonal"
          block
          color="error"
          class="text-white"
          tabindex="0"
        >
          Report a Bug / Suggest a Feature
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/discussions"
          size="large"
          variant="tonal"
          block
          color="error"
          class="text-white"
        >
          Discussion Forum
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          target="_blank"
          href="https://github.com/massif-press/compcon/wiki"
          size="large"
          variant="tonal"
          block
          color="error"
          class="text-white"
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
    <!-- <h3 class="heading text-accent">Tutorial Mode</h3>
    <p class="panel py-3 text-center text-disabled">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
    <h3 class="heading text-accent mt-4">Quick FAQ</h3>
    <v-row class="body-text text-text">
      <v-col>
        <b>Where are the NPCs?</b>
        <v-divider class="my-1" />
        <p>
          If you bought the LANCER Core Book, you'll find a downloadable data package that contains
          all Core NPC data on the LANCER Core Book's itch.io page, which you can access through the
          Content Manager. You can use the Content Manager's <b>Install LCP</b> tab to import the
          package and start building and running encounters.
        </p>
      </v-col>
      <v-col>
        <b>How do I add content from Lancer expansions to COMP/CON?</b>
        <v-divider class="my-1" />
        <p>
          Official LANCER content can be found on
          <a target="_blank" href="https://massif-press.itch.io/">Massif Press's itch.io page.</a>
          Player-facing LCP content for COMP/CON can be found in the <b>Download demo</b> section
          for any Massif Press publication; GM-facing content (i.e. NPCs) can be purchased alongside
          the PDF content. Links to this content (and featured community content) can also be found
          in the Content Manager's <b>LCP Directory</b>.
        </p>
      </v-col>
    </v-row>
    <v-row class="body-text text-text">
      <v-col>
        <b>How do I see Exotic Items in the Compendium?</b>
        <v-divider class="my-1" />
        <p>
          To prevent spoilers for players, COMP/CON defaults to hiding Exotic Items. To change their
          visibility, you can use COMP/CON's <b>Options</b> menu, and can enable the
          <b>"Show Exotic items in the Compendium"</b> toggle.
        </p>
      </v-col>
      <v-col>
        <b>Do I need to pay to make a COMP/CON cloud account?</b>
        <v-divider class="my-1" />
        <p>
          COMP/CON Cloud Accounts are free for all users. For Patreon supporters, cloud accounts
          gain access to additional features, such as the expanded cloud storage and additional
          active table instances.
        </p>
      </v-col>
    </v-row>
    <br />
    <h3 class="heading text-accent">Additional Help</h3>
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
};
</script>
