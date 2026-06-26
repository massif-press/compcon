<template>
  <v-container>
    <v-row justify="space-around" dense>
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-frequently-asked-questions"
          href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions"
          color="info"
        >
          {{ $t('nav.help.faq') }}
        </cc-button>
      </v-col>
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-help-rhombus-outline"
          href="https://github.com/massif-press/compcon/wiki/FAQ%3A-Troubleshooting"
          color="info"
        >
          {{ $t('nav.help.troubleshootingFaq') }}
        </cc-button>
      </v-col>
    </v-row>
    <v-row justify="space-around" dense class="mb-4">
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-bug"
          href="https://github.com/massif-press/compcon/issues/new/choose"
          color="primary"
        >
          {{ $t('nav.help.reportBug') }}
        </cc-button>
      </v-col>

      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-lightbulb-on"
          href="https://github.com/massif-press/compcon/issues/new/choose"
          color="primary"
        >
          {{ $t('nav.help.suggestFeature') }}
        </cc-button>
      </v-col>
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-forum"
          href="https://github.com/massif-press/compcon/discussions"
          color="primary"
          class="text-white"
        >
          {{ $t('nav.help.discussionForum') }}
        </cc-button>
      </v-col>
      <v-col>
        <cc-button
          block
          target="_blank"
          prepend-icon="mdi-format-float-left"
          href="https://github.com/massif-press/compcon/wiki"
          color="primary"
          class="text-white"
        >
          {{ $t('nav.help.projectWiki') }}
        </cc-button>
      </v-col>
    </v-row>
    <!-- <h3 class="heading text-accent">Tutorial Mode</h3>
    <p class="panel py-3 text-center text-disabled">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
    <cc-heading is-title :text="$t('nav.help.quickFaq')" />
    <v-row class="body-text text-text">
      <v-col cols="12" md="6">
        <cc-panel :title="$t('nav.help.whereAreNpcs')">
          <i18n-t keypath="nav.help.whereAreNpcsBody"
            tag="span"
            scope="global">
            <template #installLcp>
              <b>{{ $t('nav.help.installLcpTab') }}</b>
            </template>
          </i18n-t>
        </cc-panel>
      </v-col>
      <v-col cols="12" md="6">
        <cc-panel
          :title="$t('nav.help.howToAddContent')"
        >
          <i18n-t keypath="nav.help.howToAddContentBody"
            tag="span"
            scope="global">
            <template #itchLink>
              <a target="_blank"
                href="https://massif-press.itch.io/">{{ $t('nav.help.itchPageText') }}</a>
            </template>
            <template #downloadDemo>
              <b>{{ $t('nav.help.downloadDemo') }}</b>
            </template>
            <template #lcpDirectory>
              <b>{{ $t('nav.help.lcpDirectory') }}</b>
            </template>
          </i18n-t>
        </cc-panel>
      </v-col>
    </v-row>
    <v-row class="body-text text-text">
      <v-col cols="12" md="6">
        <cc-panel :title="$t('nav.help.howToSeeExotics')">
          <i18n-t keypath="nav.help.howToSeeExoticsBody"
            tag="span"
            scope="global">
            <template #options>
              <b>{{ $t('nav.help.optionsLabel') }}</b>
            </template>
            <template #showExoticsToggle>
              <b>{{ $t('nav.help.showExoticsToggleLabel') }}</b>
            </template>
          </i18n-t>
        </cc-panel>
      </v-col>
      <v-col cols="12" md="6">
        <cc-panel :title="$t('nav.help.cloudAccountFaq')">
          {{ $t('nav.help.cloudAccountFaqBody') }}
        </cc-panel>
      </v-col>
    </v-row>
    <br />
    <cc-heading is-title :text="$t('nav.help.additionalHelp')" />
    <p class="body-text">
      <i18n-t keypath="nav.help.additionalHelpBody"
        tag="span"
        scope="global">
        <template #faqLink>
          <a target="_blank"
            href="https://github.com/massif-press/compcon/wiki/Frequently-Asked-Questions"
            v-html-safe="$t('nav.help.faqLinkText')"
            tabindex="0" />
        </template>
        <template #discordLink>
          <a target="_blank"
            href="https://discord.gg/rwcpzsU"
            v-html-safe="$t('nav.help.discordLinkText')"
            tabindex="0" />
        </template>
      </i18n-t>
    </p>

    <!-- <h3 class="heading text-accent">Video Guide</h3>
    <p class="panel py-3 text-center text-disabled">
      <v-icon color="grey">mdi-lock</v-icon>
      <br />
      // FEATURE IN DEVELOPMENT //
    </p> -->
  </v-container>
</template>

<script setup lang="ts">

</script>
