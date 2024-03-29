<template>
  <v-alert v-if="show" :color="color" dense dark class="ma-0">
    <v-icon slot="prepend" x-large class="ml-n2 mr-2" color="white">{{ icon }}</v-icon>
    <div :class="`heading ${small ? 'h3' : 'h2'}`">
      <span v-if="type === 'destroyed'">MECH DESTROYED</span>
      <span v-else-if="type === 'cascading'">DANGER: UNSHACKLED NHP</span>
      <span v-else-if="type === 'overSP'">ALERT: SYSTEM CAPACITY EXCEEDED</span>
      <span v-else-if="type === 'unfinished'">WARNING: EMPTY MOUNTS DETECTED</span>
      <span v-else-if="type === 'underSP'">WARNING: SYSTEM CAPACITY REMAINING</span>
      <span v-else-if="type === 'unlicensed'">WARNING: UNLICENSED EQUIPMENT DETECTED</span>
      <span v-else-if="type === 'incompatiblemod'">WARNING: INCOMPATIBLE WEAPON MOD</span>
    </div>
    <div v-if="!small && !hideClear" class="mt-1">
      <v-btn v-if="type === 'destroyed'" block small outlined dark @click="$emit('reprint')">
        <v-icon left>cci-mech</v-icon>
        Reprint Mech
      </v-btn>
      <span v-else-if="type === 'cascading'" class="white--text flavor-text">
        UNSHACKLED NHP REPRESENT AN IMMININENT THREAT TO ANY PERSONS OR PROPERTY WITHIN THE MAXIMUM
        OPERATIONAL AREA OF THE FRAME. FAILURE TO HARDCYCLE CONSTITUTES CONTRIBUTORY NEGLIGENCE
        UNDER UNION LAW.
      </span>
      <span v-else-if="type === 'overSP'" class="white--text flavor-text">
        Loadout configuration exceeds available Frame System Capacity
      </span>
      <span v-else-if="type === 'unfinished' || type === 'underSP'" class="white--text flavor-text">
        Operational capacity significantly impaired
      </span>
      <span v-else-if="type === 'unlicensed'" class="white--text flavor-text">
        Pilot is missing one or more licenses required to legally print or operate this
        configuration
      </span>
      <span v-else-if="type === 'incompatiblemod'" class="white--text flavor-text">
        One or more weapon mods are installed to incompatible weapons
      </span>
    </div>
  </v-alert>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ name: 'status-alert' })
export default class CCMechStatusAlert extends Vue {
  @Prop({ type: String, required: true })
  readonly type!: string
  @Prop({ type: Boolean })
  readonly criticalOnly?: boolean
  @Prop({ type: Boolean })
  readonly hideClear?: boolean

  get small() {
    return this.$vuetify.breakpoint.smAndDown
  }

  get show() {
    if (!this.criticalOnly) return true
    switch (this.type) {
      case 'overSP':
      case 'underSP':
      case 'unfinished':
      case 'unlicensed':
      case 'incompatiblemod':
        return false
      default:
        return true
    }
  }
  get icon() {
    switch (this.type) {
      case 'destroyed':
        return 'mdi-image-broken-variant'
        break
      case 'meltdown':
        return 'mdi-alert-outline'
        break
      case 'reactorDestroyed':
        return 'mdi-nuke'
        break
      case 'unshackled':
        return 'mdi-link-variant-off'
        break
      case 'overSP':
      case 'underSP':
        return 'cci-system'
        break
      case 'unfinished':
        return 'mdi-alert'
        break
      case 'unlicensed':
        return 'cci-license'
        break
      case 'incompatiblemod':
        return 'cci-status-downandout'
        break
      default:
        return ''
        break
    }
  }
  get color() {
    switch (this.type) {
      case 'destroyed':
      case 'cascading':
        return 'error'
        break
      case 'meltdown':
        return 'dangerzone'
        break
      case 'reactorDestroyed':
        return 'error darken-1'
        break
      case 'overSP':
      case 'unlicensed':
        return 'warning darken-1'
        break
      case 'incompatiblemod':
        return 'warning darken-1'
        break
      default:
        return 'grey darken-1'
        break
    }
  }
}
</script>
