<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="85vw"
  >
    <v-card tile class="background">
      <action-titlebar :action="action" :mech="mech" @hide="hide()" />
      <v-card-text class="pt-5 pb-0">
        <cc-active-synergy :locations="action.SynergyLocations" :mech="mech" class="mb-n4" />
        <component
          :is="component"
          v-if="component"
          ref="c"
          :mech="mech"
          :action="action"
          @use="use($event)"
        />
      </v-card-text>
      <action-confirm-log
        :key="`${action.Used}_${action.LogID}`"
        :used="action.Used"
        :action="action"
        :mech="mech"
        @undo="undo()"
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
    use(free) {
      this.mech.Pilot.State.CommitAction(this.action, free)
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      Vue.nextTick().then(() => self.$forceUpdate())
    },
    undo() {
      this.mech.Pilot.State.UndoAction(this.action)
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      Vue.nextTick().then(() => self.$forceUpdate())
    },
    show() {
      this.dialog = true
    },
    hide() {
      this.dialog = false
    },
  },
})
</script>
