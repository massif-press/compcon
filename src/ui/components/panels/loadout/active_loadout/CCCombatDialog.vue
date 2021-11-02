<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="85vw"
    class="suppress-horiz"
  >
    <v-card tile class="background suppress-horiz" style="min-height: 175px; height: 100%">
      <action-titlebar
        :used="action.Used"
        :no-action="noAction"
        :action="action"
        :mech="mech"
        @hide="hide()"
      />
      <v-card-text class="pt-1 pb-0">
        <cc-active-synergy :locations="action.SynergyLocations" :mech="mech" class="mb-n4" />
        <component
          :is="component"
          v-if="component"
          ref="c"
          :fulltech="fulltech"
          :used="action.Used"
          :mech="mech"
          :action="action"
          @use="use($event)"
          @hide="hide()"
        />
      </v-card-text>
      <tech-attack
        v-if="action.IsTechAttack"
        :used="techAttack"
        :action="action"
        :mech="mech"
        @techAttackComplete="techAttackComplete($event)"
      />
      <action-confirm-log
        ref="log"
        :used="displayLog"
        :action="action"
        :mech="mech"
        :log-override="logOverride"
        :hide-log="action && action.ID === 'act_self_destruct'"
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
import TechAttack from './components/_TechAttack.vue'

function toTitleCase(str): string {
  str = str.toLowerCase().split(' ')
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
  }
  return str.join('')
}

export default Vue.extend({
  name: 'cc-combat-dialog',
  components: { ActionTitlebar, ActionConfirmLog, TechAttack },
  props: {
    action: {
      type: Object,
      required: true,
    },
    mech: {
      type: Object,
      required: true,
    },
    noAction: { type: Boolean },
    fulltech: { type: Boolean, default: false },
  },
  data() {
    return {
      dialog: false,
      component: null,
      techAttack: false,
      displayLog: false,
      logOverride: [],
    }
  },
  computed: {
    loader() {
      if (!this.action) {
        return null
      }
      const name = toTitleCase(this.action.Name)
      return () => import(`./dialogs/action/_${name}Dialog.vue`)
    },
    itemLoader() {
      if (!this.action) {
        return null
      }
      return () => import(`./dialogs/action/_ItemActionDialog.vue`)
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
    this.techAttack = false
  },
  methods: {
    use(free) {
      if (!this.fulltech) this.mech.Pilot.State.CommitAction(this.action, free)
      if (this.action.IsTechAttack) {
        this.techAttack = true
      } else {
        this.displayLog = this.action.AnyUsed
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        this.$emit('use', free)
        Vue.nextTick().then(() => self.$forceUpdate())
      }
    },
    undo() {
      this.mech.Pilot.State.UndoAction(this.action)
      this.$emit('undo')
      this.techAttack = false
      this.displayLog = false
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      Vue.nextTick().then(() => self.$forceUpdate())
    },
    techAttackComplete(success) {
      if (this.fulltech) {
        this.techAttack = false

        if (success) this.$emit('add-invade', this.action)
        else this.$emit('add-fail', this.action.Name)

        this.hide()
      } else {
        this.logOverride = ['UPLINK ESTABLISHED. ATTEMPTING REMOTE ACCESS.']
        if (success) {
          this.logOverride.push('SYSTEM ACCESS OBTAINED.')
          this.logOverride = this.logOverride.concat(this.action.Confirm)
        } else this.logOverride.push('ACCESS DENIED. SYSTEM FAILURE.')
        this.displayLog = true
      }

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      this.$emit('use')
      Vue.nextTick().then(() => self.$forceUpdate())
    },
    show() {
      this.dialog = true
    },
    hide() {
      if (!this.$refs.c.init) {
        console.log('no init fn', this.$refs.c.name)
      } else {
        this.$refs.c.init()
        this.$refs.log.init()
      }
      this.dialog = false
    },
  },
})
</script>

<style scoped>
.suppress-horiz {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
