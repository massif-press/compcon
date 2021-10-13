<template>
  <div>
    <cloud-manager
      ref="cloud"
      :pilot="pilot"
      @start-sync="syncing = true"
      @end-sync="syncing = false"
    />

    <cc-solo-dialog ref="dialog" icon="mdi-cloud-outline" large no-confirm title="Pilot Vault Data">
      <v-card-text>
        <div v-if="pilot.IsLocallyOwned">
          <v-alert prominent dense outlined icon="mdi-cloud-check-outline">
            <div class="heading h3">
              This pilot is registered to
              <span class="primary--text">your</span>
              COMP/CON account
            </div>
            <div>
              Changes you make to this pilot will be transmitted to other users when they sync their
              accounts or their copy of this pilot.
            </div>
          </v-alert>
          <div class="text-center">
            <div class="overline">THIS PILOT'S VAULT CODE IS</div>
            <div class="heading h3 primary--text">
              {{ getShareCode }}
              <cc-tooltip simple inline content="Copy Vault Code to clipboard">
                <v-icon :color="copyConfirm ? 'success' : 'grey'" @click="copyCode()">
                  {{ copyConfirm ? 'mdi-check-outline' : 'mdi-clipboard-text-outline' }}
                </v-icon>
              </cc-tooltip>
            </div>
            <p class="body--text">
              This code can be shared with other users that have COMP/CON accounts. Updates
              <b class="primary--text">you</b>
              make to this pilot will overwrite their local data for this pilot when they sync.
              Changes
              <b class="secondary--text">they</b>
              have made to your pilot will not update your data
            </p>
          </div>
        </div>
        <div v-else>
          <v-alert prominent dense outlined icon="mdi-cloud-off-outline">
            <div class="heading h3">
              This pilot is registered to
              <span class="primary--text">another user's</span>
              COMP/CON account
            </div>
            <div>
              Changes they have made to this pilot will overwrite your local data whenever you sync.
            </div>
          </v-alert>
          <p class="body--text">
            This pilot is owned by another user and has been shared with you via a Vault Code.
            Changes
            <b class="secondary--text">they</b>
            make to this pilot will
            <b class="primary--text">overwrite your changes</b>
            whenever you sync your account. Changes you make to this pilot will not update their
            data.
          </p>
        </div>
      </v-card-text>
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CloudManager from './CloudManager.vue'

export default Vue.extend({
  name: 'vault-dialog',
  components: { CloudManager },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    syncing: false,
    copyConfirm: false,
  }),
  computed: {
    getShareCode() {
      return this.pilot.ShareCode
    }
  },
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    async copyCode() {
      this.copyConfirm = true

      navigator.clipboard.writeText(this.getShareCode).then(
        function () {
          Vue.prototype.$notify('Cloud ID copied to clipboard.', 'confirmation')
        },
        function () {
          Vue.prototype.$notifyError('Unable to copy Cloud ID')
        }
      )
      setTimeout(() => {
        this.copyConfirm = false
      }, 1200)
    },
  },
})
</script>
