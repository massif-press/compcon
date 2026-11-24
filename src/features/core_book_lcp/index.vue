<template>
  <v-container style="max-width: 900px">
    <div class="heading h2 text-center my-6">
      {{ $t('mainMenu.coreBookLcp.whichPrintHeader') }}
    </div>
    <v-btn-toggle
      v-model="selected"
      color="accent"
      divided
      class="d-flex flex-wrap justify-center"
      style="height: auto"
    >
      <v-btn
        v-for="print in prints"
        :key="print.value"
        :value="print.value"
        size="large"
      >
        {{ $t(print.label) }}
      </v-btn>
    </v-btn-toggle>

    <v-window
      v-model="selected"
      class="mt-6"
    >
      <v-window-item
        v-for="print in prints"
        :key="print.value"
        :value="print.value"
      >
        <v-container>
          <cc-panel :title="$t('mainMenu.coreBookLcp.assets.title')">
            <p>{{ $t(print.assetsIntro) }}</p>
            <br />
            <p>
              <strong><core-book-lcp-text :keypath="print.assetsSupport" /></strong>
            </p>
          </cc-panel>

          <cc-panel
            :title="$t('mainMenu.coreBookLcp.linking.title')"
            class="mt-6"
          >
            <v-alert
              color="warning"
              icon="mdi-alert"
            >
              {{ $t('mainMenu.coreBookLcp.linking.accountRequired') }}
            </v-alert>
            <br />
            <p class="mb-4">{{ $t('mainMenu.coreBookLcp.linking.intro') }}</p>
            <v-alert
              v-for="(step, i) in print.steps"
              :key="i"
              color="info"
              :icon="`mdi-numeric-${i + 1}-circle`"
              class="my-2"
            >
              <p
                v-for="(paragraph, j) in step"
                :key="paragraph"
                :class="j > 0 && 'mt-4'"
              >
                <core-book-lcp-text :keypath="paragraph" />
              </p>
            </v-alert>

            <v-card :title="$t('mainMenu.coreBookLcp.troubleshooting.title')">
              <v-card-text
                v-for="item in print.troubleshooting"
                :key="item.body"
              >
                <h3 class="mb-2 text-accent">{{ $t(item.title) }}</h3>
                <core-book-lcp-text :keypath="item.body" />
              </v-card-text>
            </v-card>

            <sub><core-book-lcp-text keypath="mainMenu.coreBookLcp.instructionsPermalink" /></sub>
          </cc-panel>
        </v-container>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CoreBookLcpText from './CoreBookLcpText.vue'

  const qrSteps = [
    ['mainMenu.coreBookLcp.steps.followQrCode'],
    ['mainMenu.coreBookLcp.steps.copyQrUrl'],
  ]

  const accountSteps = [
    ['mainMenu.coreBookLcp.steps.logIn'],
    ['mainMenu.coreBookLcp.steps.enterUnlockCode'],
    [
      'mainMenu.coreBookLcp.steps.confirmLink',
      'mainMenu.coreBookLcp.steps.confirmLinkSubscriptions',
    ],
  ]

  const urlRejected = {
    title: 'mainMenu.coreBookLcp.troubleshooting.urlRejectedTitle',
    body: 'mainMenu.coreBookLcp.troubleshooting.urlRejectedBody',
  }

  const noQrCodeTitle = 'mainMenu.coreBookLcp.troubleshooting.noQrCodeTitle'

  const prints = [
    {
      value: 'kickstarter',
      label: 'mainMenu.coreBookLcp.printOriginalKickstarter',
      assetsIntro: 'mainMenu.coreBookLcp.assets.kickstarterIntro',
      assetsSupport: 'mainMenu.coreBookLcp.assets.kickstarterSupport',
      steps: [
        ['mainMenu.coreBookLcp.steps.findRewardEmail'],
        ['mainMenu.coreBookLcp.steps.copyRewardUrl'],
        ...accountSteps,
      ],
      troubleshooting: [
        {
          title: 'mainMenu.coreBookLcp.troubleshooting.noRewardEmailTitle',
          body: 'mainMenu.coreBookLcp.troubleshooting.noRewardEmailBody',
        },
        {
          title: 'mainMenu.coreBookLcp.troubleshooting.secondhandCopyTitle',
          body: 'mainMenu.coreBookLcp.troubleshooting.secondhandCopyBody',
        },
        urlRejected,
      ],
    },
    {
      value: 'dark-horse',
      label: 'mainMenu.coreBookLcp.printDarkHorse',
      assetsIntro: 'mainMenu.coreBookLcp.assets.qrIntro',
      assetsSupport: 'mainMenu.coreBookLcp.assets.darkHorseSupport',
      steps: [...qrSteps, ...accountSteps],
      troubleshooting: [
        {
          title: noQrCodeTitle,
          body: 'mainMenu.coreBookLcp.troubleshooting.noQrCodeDarkHorseBody',
        },
        urlRejected,
      ],
    },
    {
      value: 'non-english',
      label: 'mainMenu.coreBookLcp.printNonEnglish',
      assetsIntro: 'mainMenu.coreBookLcp.assets.qrIntro',
      assetsSupport: 'mainMenu.coreBookLcp.assets.nonEnglishSupport',
      steps: [...qrSteps, ...accountSteps],
      troubleshooting: [
        {
          title: noQrCodeTitle,
          body: 'mainMenu.coreBookLcp.troubleshooting.noQrCodeNonEnglishBody',
        },
        urlRejected,
      ],
    },
  ]

  const selected = ref<string | undefined>(undefined)
</script>
