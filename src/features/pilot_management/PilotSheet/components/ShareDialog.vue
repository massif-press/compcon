<template>
  <v-card-text :class="mobile && 'px-0'">
    <cc-alert density="compact"
      class="text-text"
      title="Please use responsibly"
      icon="mdi-alert">
      Share codes allow anyone to view COMP/CON data and receive updates the author makes. Neither
      Massif Press nor the developer of COMP/CON are responsible for any shared content. Please be
      conscientious when sharing data with others.
    </cc-alert>

    <v-row dense
      class="mt-4 mx-1"
      justify="space-around">
      <v-col cols="auto">
        <div class="text-cc-overline text-disabled">LAST LOCAL UPDATE</div>
        <div class="font-weight-bold pt-1">
          {{ localModifiedLabel }}
        </div>
      </v-col>
      <v-col cols="auto">
        <div class="text-cc-overline text-disabled">LAST SYNCED</div>
        <div class="font-weight-bold pt-1">
          {{ lastSyncLabel }}
        </div>
      </v-col>
      <v-col cols="auto">
        <div class="text-cc-overline text-disabled">STATUS</div>
        <div class="d-flex align-center">
          <v-chip v-if="!pilot.CloudController.Metadata?.Updated"
            color="warning"
            size="small"
            prepend-icon="mdi-cloud-upload-outline">
            Not yet synced
          </v-chip>
          <v-chip v-else-if="!pilot.CloudController.isSynced"
            color="warning"
            size="small"
            prepend-icon="mdi-cloud-sync">
            Sync needed
          </v-chip>
          <v-chip v-else
            color="success"
            size="small"
            class="rounded-0 rounded-be-lg"
            prepend-icon="mdi-cloud-check-variant-outline">
            Up to date
          </v-chip>
        </div>
      </v-col>
      <v-col v-if="!pilot.CloudController.isSynced"
        cols="auto">
        <cc-button size="small"
          color="primary"
          class="ml-2"
          :loading="syncing"
          prepend-icon="mdi-sync"
          @click="syncPilot">
          Sync Now
        </cc-button>
      </v-col>
    </v-row>

    <div v-if="pilot.CloudController.ShareCode"
      :class="mobile && 'text-center'">
      <v-row justify="center">
        <v-col cols="auto">
          <div class="text-cc-overline mt-4">
            PILOT SHARE CODE
            <v-tooltip>
              <template #activator="{ props }">
                <v-icon v-bind="props"
                  icon="mdi-information-slab-box-outline"
                  size="x-large" />
              </template>
              <div>
                This link will allow other users with a COMP/CON account to save a copy of this
                pilot to their pilot roster and subscribe to updates you make.
              </div>
            </v-tooltip>
          </div>
          <b class="text-accent"
            style="font-size: calc(30px + 2vw)"
            v-text="`${pilot.CloudController.ShareCode.slice(0, 4)}-${pilot.CloudController.ShareCode.slice(4, 8)}-${pilot.CloudController.ShareCode.slice(8, 12)}`
              " />
          <v-tooltip text="Copy share code to clipboard">
            <template #activator="{ props }">
              <v-icon v-bind="props"
                @click.stop="copy()">mdi-clipboard-text-outline</v-icon>
            </template>
          </v-tooltip>
          <fieldset class="px-2 pb-2">
            <legend class="text-cc-overline mt-4 mx-3 px-2">
              SHARE LINK
            </legend>
            <v-row no-gutters
              align="end">
              <v-col>
                <div class="text-caption text-center">
                  This link is a
                  <b class="text-accent">publicly accessible URL</b>
                  that allows anyone to view this pilot's data.
                </div>
                <v-text-field v-model="shareLink"
                  readonly
                  flat
                  tile
                  density="compact"
                  hide-details
                  class="my-1"
                  style="font-size: calc(16px + 0.5vw)"
                  @click="copyShareLink()">
                  <template #append-inner>
                    <v-tooltip text="Copy share link to clipboard">
                      <template #activator="{ props }">
                        <v-icon v-bind="props"
                          @click.stop="copyShareLink()">
                          mdi-clipboard-text-outline
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row dense
              align="center">
              <v-col>
                <div class="text-cc-overline">SHEET STYLE</div>
                <cc-select v-model="linkStyle"
                  density="compact"
                  hide-details
                  chip-variant="text"
                  :items="[
                    { title: 'Full', value: 'full' },
                    { title: 'Build Only', value: 'build' },
                  ]" />
              </v-col>
              <v-col>
                <div class="text-cc-overline">INCLUDE MECH</div>

                <cc-select v-model="shareMech"
                  density="compact"
                  chip-variant="text"
                  :items="mechOptions" />
              </v-col>
            </v-row>
          </fieldset>
        </v-col>
      </v-row>
    </div>
    <v-alert v-else
      flat
      tile
      variant="tonal"
      color="warning"
      class="mt-4 text-center">
      This pilot does not have a share code. To share this pilot, you must first sync it to your
      COMP/CON account by clicking the "Sync Now" button above.
    </v-alert>
  </v-card-text>
</template>

<script lang="ts">
import { useMobile } from '@/mixins/useMobile'
import { CloudController } from '@/classes/components/cloud/CloudController'
import logger from '@/user/logger'

export default {
  name: 'ShareDialog',
  mixins: [useMobile],
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    linkStyle: 'full',
    shareMech: '',
    syncing: false,
  }),
  computed: {
    shareLink() {
      return `https://compcon.app/link/pilot/${this.pilot.CloudController.ShareCode}/${this.linkStyle}/${this.shareMech}`
    },
    mechOptions() {
      const arr = [{ title: 'None', value: '' }]
      arr.push(
        ...this.pilot.Mechs.map((m) => ({
          title: `${m.Name} (${m.Frame.Source} ${m.Frame.Name})`,
          value: m.ID,
        }))
      )
      return arr
    },
    localModifiedLabel() {
      const t = this.pilot.SaveController?.LastModified
      if (!t) return 'Unknown'
      const diff = Date.now() - t
      if (diff < 60_000) return 'Just now'
      if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
      if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
      return new Date(t).toLocaleDateString()
    },
    lastSyncLabel() {
      const t = this.pilot.CloudController.Metadata?.Updated
      if (!t) return 'Never'
      const diff = Date.now() - t
      if (diff < 60_000) return 'Just now'
      if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
      if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
      return new Date(t).toLocaleDateString()
    },
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.pilot.CloudController.ShareCode)
    },
    copyShareLink() {
      navigator.clipboard.writeText(this.shareLink)
    },
    async syncPilot() {
      this.syncing = true
      try {
        if (this.pilot.CloudController.Metadata?.Updated) {
          await this.pilot.CloudController.syncFromCloud()
        } else {
          await CloudController.ForceUpload(this.pilot)
        }
        this.$notify({
          title: 'Sync Complete',
          text: `${this.pilot.Callsign} synced to cloud.`,
          data: { icon: 'mdi-cloud-check-variant', color: 'success-darken-2' },
        })
      } catch (err) {
        logger.error(`ShareDialog: sync failed for ${this.pilot.Callsign}`, err)
        this.$notify({
          title: 'Sync Failed',
          text: `${err}`,
          data: { icon: 'mdi-alert', color: 'error' },
        })
      } finally {
        this.syncing = false
      }
    },
  },
}
</script>
