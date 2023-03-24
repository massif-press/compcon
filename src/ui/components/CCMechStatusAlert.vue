<template>
  <v-alert v-if="show" :color="color" dense dark class="ma-0">
    <v-icon slot="prepend" x-large class="ml-n2 mr-2" color="white">{{
      icon
    }}</v-icon>
    <div :class="`heading ${small ? 'h3' : 'h2'}`">
      <span v-if="type === 'destroyed'">MECH DESTROYED</span>
      <span v-else-if="type === 'cascading'">DANGER: UNSHACKLED NHP</span>
      <span v-else-if="type === 'overSP'">ALERT: SYSTEM CAPACITY EXCEEDED</span>
      <span v-else-if="type === 'unfinished'"
        >WARNING: EMPTY MOUNTS DETECTED</span
      >
      <span v-else-if="type === 'underSP'"
        >WARNING: SYSTEM CAPACITY REMAINING</span
      >
      <span v-else-if="type === 'unlicensed'"
        >WARNING: UNLICENSED EQUIPMENT DETECTED</span
      >
    </div>
    <div v-if="!small && !hideClear" class="mt-1">
      <v-btn
        v-if="type === 'destroyed'"
        block
        small
        variant="outlined"
        dark
        @click="$emit('reprint')"
      >
        <v-icon start>cc:mech</v-icon>
        Reprint Mech
      </v-btn>
      <span v-else-if="type === 'cascading'" class="white--text flavor-text">
        UNSHACKLED NHP REPRESENT AN IMMININENT THREAT TO ANY PERSONS OR PROPERTY
        WITHIN THE MAXIMUM OPERATIONAL AREA OF THE FRAME. FAILURE TO HARDCYCLE
        CONSTITUTES CONTRIBUTORY NEGLIGENCE UNDER UNION LAW.
      </span>
      <span v-else-if="type === 'overSP'" class="white--text flavor-text">
        Loadout configuration exceeds available Frame System Capacity
      </span>
      <span
        v-else-if="type === 'unfinished' || type === 'underSP'"
        class="white--text flavor-text"
      >
        Operational capacity significantly impaired
      </span>
      <span v-else-if="type === 'unlicensed'" class="white--text flavor-text">
        Pilot is missing one or more licenses required to legally print or
        operate this configuration
      </span>
    </div>
  </v-alert>
</template>

<script lang="ts">
export default {
  name: 'CCMechStatusAlert',
  props: {
    type: {
      type: String,
      required: true,
    },
    criticalOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideClear: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    small(): boolean {
      return this.$vuetify.display.smAndDown;
    },
    show(): boolean {
      if (!this.criticalOnly) return true;
      switch (this.type) {
        case 'overSP':
        case 'underSP':
        case 'unfinished':
        case 'unlicensed':
          return false;
        default:
          return true;
      }
    },
    icon(): string {
      switch (this.type) {
        case 'destroyed':
          return 'mdi-image-broken-variant';
        case 'meltdown':
          return 'mdi-alert-outline';
        case 'reactorDestroyed':
          return 'mdi-nuke';
        case 'unshackled':
          return 'mdi-link-variant-off';
        case 'overSP':
        case 'underSP':
          return 'cc:system';
        case 'unfinished':
          return 'mdi-alert';
        case 'unlicensed':
          return 'cc:license';
        default:
          return '';
      }
    },
    color(): string {
      switch (this.type) {
        case 'destroyed':
          return 'error';
        case 'meltdown':
          return 'warning';
        case 'reactorDestroyed':
          return 'error';
        case 'unshackled':
          return 'error';
        case 'overSP':
          return 'warning';
        case 'underSP':
          return 'warning';
        case 'unfinished':
          return 'warning';
        case 'unlicensed':
          return 'warning';
        default:
          return '';
      }
    },
  },
};
</script>
