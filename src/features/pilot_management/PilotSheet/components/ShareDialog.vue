<template>
  <div>
    <v-alert outlined dense prominent icon="mdi-information-outline" class="body-text mt-2">
      Generating a share code for this pilot will allow other users with COMP/CON cloud accounts to
      download a copy and subscribe to updates you make to this pilot. Regenerating a share code
      will prevent subscribers from downloading future updates under the old share code.
    </v-alert>
    <div v-if="pilot.CloudController.ShareCode">
      <v-row justify="center">
        <v-col cols="auto" class="py-12">
          <div class="overline mb-4">PILOT SHARE CODE</div>
          <b
            class="accent--text"
            style="font-size: 80px; letter-spacing: 15px"
            v-text="pilot.CloudController.ShareCode"
          />
          <cc-tooltip simple inline content="Copy share code to clipboard">
            <v-btn icon small class="ml-n3" @click="copy()">
              <v-icon small>mdi-clipboard-text-outline</v-icon>
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
      <div class="text-center px-6">
        <b class="accent--text">
          Share codes are valid for 90 days, after which the code will expire. This pilot's code
          will expire on
          {{ pilot.CloudController.ShareCodeExpiration }}. This can be extended by clicking the
          button below
        </b>
        <br />
        <v-btn
          right
          color="primary"
          class="mt-2"
          small
          :disabled="isSameDate"
          v-text="
            isSameDate
              ? 'Already at maximum'
              : `Extend to
          ${extendedDate}`
          "
          @click="refresh(pilot)"
        />
        <div v-if="isSameDate" class="caption text-disabled"></div>
      </div>
      <v-row justify="end" class="mt-12">
        <v-col cols="auto">
          <cc-tooltip
            content="Regenerating this item's share code will prevent any other users from updating their copies of this Pilot until they re-import with the new code."
          >
            <v-btn x-small color="error" @click="generate()">
              Delete and Regenerate Share Code
            </v-btn>
          </cc-tooltip>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row justify="center">
        <v-col cols="auto" class="py-12 text-center">
          <v-btn x-large class="primary" :loading="loading" @click="generate()">
            Generate Pilot Share Code
          </v-btn>
          <div v-show="!pilot.CloudController.LastUpdateCloud" class="overline text-disabled">
            Generating a Share Code will upload this pilot to your cloud account
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { generateCode, refreshItem } from '@/io/apis/share'

export default Vue.extend({
  name: 'share-dialog',
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    isSameDate() {
      return (
        Math.floor(
          (new Date().valueOf() - new Date(this.pilot.CloudController.ShareCodeExpiry).valueOf()) /
            (1000 * 60 * 60 * 24)
        ) < 1
      )
    },
    extendedDate() {
      const d = new Date()
      d.setDate(d.getDate() + 90)

      return d.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
  methods: {
    async generate() {
      this.loading = true
      const res = await generateCode(this.pilot)
      this.pilot.CloudController.SetShareCode(res)
      this.$notify('Share Code generated', 'success')
      this.loading = false
    },
    async refresh() {
      this.loading = true
      const c = this.pilot.CloudController.ShareCode
      await refreshItem(c)
      this.pilot.CloudController.SetShareCode(c)
      this.$notify('Share Code refreshed', 'success')
      this.loading = false
    },
    copy() {
      navigator.clipboard
        .writeText(this.pilot.CloudController.ShareCode)
        .then(() => Vue.prototype.$notify('Cloud ID copied to clipboard.', 'confirmation'))
        .catch(() => Vue.prototype.$notifyError('Unable to copy Cloud ID'))
    },
  },
})
</script>
