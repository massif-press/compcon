<template>
  <v-alert v-if="show" :color="color" dense dark>
    <v-icon slot="prepend" x-large class="ml-n2 mr-2" color="white">{{ icon }}</v-icon>
    <div class="heading h2">
      <span v-if="type === 'ejected'">ALERT: PILOT EJECTED</span>
      <span v-else-if="type === 'destroyed'">MECH DESTROYED</span>
      <span v-else-if="type === 'meltdown'">DANGER: REACTOR MELTDOWN IMMINENT</span>
      <span v-else-if="type === 'reactorDestroyed'">REACTOR DESTROYED</span>
      <span v-else-if="type === 'cascading'">DANGER: UNSHACKLED NHP</span>
      <span v-else-if="type === 'overSP'">ALERT: SYSTEM CAPACITY EXCEEDED</span>
      <span v-else-if="type === 'unfinished'">WARNING: EMPTY MOUNTS DETECTED</span>
      <span v-else-if="type === 'underSP'">WARNING: SYSTEM CAPACITY REMAINING</span>
      <span v-else-if="type === 'unlicensed'">WARNING: UNLICENSED EQUIPMENT DETECTED</span>
    </div>
    <div v-if="!hideClear">
      <v-btn v-if="type === 'ejected'" block small outlined dark @click="$emit('clear-ejected')">
        <v-icon left>cci-pilot</v-icon>
        Confirm Pilot has re-boarded mech
      </v-btn>
      <v-btn
        v-else-if="type === 'destroyed'"
        block
        small
        outlined
        dark
        @click="$emit('clear-status')"
      >
        <v-icon left>cci-mech</v-icon>
        Repair Mech
      </v-btn>
      <v-btn
        v-else-if="type === 'meltdown'"
        block
        small
        outlined
        dark
        @click="$emit('clear-status')"
      >
        Vent Reactor
      </v-btn>
      <v-btn
        v-else-if="type === 'reactorDestroyed'"
        block
        small
        outlined
        dark
        @click="$emit('clear-status')"
      >
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
        Pilot is missing one or more licenses required to legally print this configuration
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

  get show() {
    if (!this.criticalOnly) return true
    switch (this.type) {
      case 'overSP':
      case 'underSP':
      case 'unfinished':
      case 'unlicensed':
        return false
      default:
        return true
    }
  }
  get icon() {
    switch (this.type) {
      case 'ejected':
        return 'mdi-account-off-outline'
        break
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
        return 'accent darken-1'
        break
      case 'overSP':
      case 'ejected':
      case 'unlicensed':
        return 'warning darken-1'
        break
      default:
        return 'grey darken-1'
        break
    }
  }
}
</script>
