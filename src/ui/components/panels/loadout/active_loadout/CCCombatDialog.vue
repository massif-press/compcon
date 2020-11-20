<template>
  <v-dialog
    :key="`${action.ID}_${action.LogID}`"
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="85vw"
  >
    <v-card tile class="background">
      {{ action.LogID }}
      <action-titlebar :action="action" :mech="mech" @hide="hide()" />
      <v-card-text class="pt-5 pb-0">
        <cc-active-synergy :locations="action.SynergyLocations" :mech="mech" class="mb-n4" />
        <component :is="component" v-if="component" ref="c" :mech="mech" :action="action" />
      </v-card-text>
      <action-confirm-log
        :key="`${action.ID}_${action.LogID}`"
        :action="action"
        :mech="mech"
        @hide="hide()"
      />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionConfirmLog from './components/_ActionConfirmLog.vue'
import ActionTitlebar from './components/_ActionTitlebar.vue'

function toTitleCase(str): string {
  str = str.toLowerCase().split(' ')
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
  }
  return str.join('')
}

export default Vue.extend({
  name: 'cc-combat-dialog',
  components: { ActionTitlebar, ActionConfirmLog },
  props: {
    action: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      component: null,
    }
  },
  computed: {
    loader() {
      if (!this.action) {
        return null
      }
      const name = toTitleCase(this.action.Name)
      return () => import(`./dialogs/_${name}Dialog.vue`)
    },
    itemLoader() {
      if (!this.action) {
        return null
      }
      return () => import(`./dialogs/_ItemActionDialog.vue`)
    },
  },
  mounted() {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        this.component = () => this.itemLoader()
      })
  },
  methods: {
    show() {
      this.dialog = true
    },
    hide() {
      this.dialog = false
    },
  },
})
</script>
