<template>
  <v-card variant="outlined" color="error" class="py-1" :max-width="width" style="font-size: 13px">
    <v-row
      v-if="!controller.OtherError"
      v-for="b in controller.Brews"
      :key="b.LcpName"
      dense
      align="center"
      class="ml-1">
      <v-col cols="auto">
        <v-tooltip location="top" open-delay="300" max-width="300">
          <template #activator="{ props }">
            <span v-bind="props">
              <v-icon v-if="b.Status === 'MISSING'" color="error" icon="mdi-alert-rhombus" />
              <v-icon
                v-else-if="b.Status === 'OFF'"
                color="warning"
                icon="mdi-power-plug-off-outline" />
              <v-icon
                v-else-if="b.Status === 'OLD'"
                color="accent"
                icon="mdi-clock-alert-outline" />
              <v-icon v-else color="success" icon="mdi-check-bold" />
            </span>
          </template>
          <i18n-t v-if="b.Status === 'MISSING' || b.Status === 'OFF'" keypath="ui.missing.usesContent" tag="span" scope="global">
            <template #pack><b class="text-accent">{{ b.LcpName }}</b></template>
            <template #instanced><b>{{ $t('ui.missing.instanced') }}</b></template>
            <template #state>{{ b.status === 'MISSING' ? $t('ui.missing.installedActivated') : $t('ui.missing.activated') }}</template>
          </i18n-t>
          <i18n-t v-else-if="b.Status === 'OLD'" keypath="ui.missing.requestsNewer" tag="span" scope="global">
            <template #pack><b class="text-accent">{{ b.LcpName }}</b></template>
          </i18n-t>
          <span v-else>{{ $t('ui.missing.packActive', { pack: b.LcpName }) }}</span>
        </v-tooltip>
      </v-col>
      <v-col cols="auto">
        {{ b.LcpName }}
      </v-col>
      <v-col cols="auto"><cc-slashes /></v-col>

      <v-col cols="auto">
        {{ b.LcpVersion }}
      </v-col>
      <v-col v-if="b.Status === 'MISSING' && b.Website" cols="auto" class="ml-2">
        <v-btn
          size="x-small"
          :href="b.Website"
          target="_blank"
          rel="noopener noreferrer"
          variant="tonal"
          color="error">
          <v-icon icon="mdi-open-in-new" start />
          {{ $t('ui.lcp.downloadLcp') }}
        </v-btn>
      </v-col>
      <v-col v-else-if="b.Status === 'OLD' && b.Website" cols="auto" class="ml-6">
        <v-btn
          size="x-small"
          :href="b.Website"
          target="_blank"
          rel="noopener noreferrer"
          flat
          tile
          color="secondary">
          <v-icon icon="mdi-open-in-new" start />
          {{ $t('ui.lcp.updateLcp') }}
        </v-btn>
      </v-col>
    </v-row>
    <p v-if="controller.OtherError" class="text-center">
      {{ $t('ui.missing.otherError') }}
      <br />
      {{ $t('ui.missing.checkLog') }}
    </p>
  </v-card>
</template>

<script setup lang="ts">
defineOptions({ name: 'cc-brew-info' })

const props = withDefaults(defineProps<{
  controller: object
  width?: string
}>(), {
  width: '100%'
})
</script>
