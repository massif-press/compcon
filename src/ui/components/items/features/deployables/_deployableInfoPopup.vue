<template>
  <cc-dialog no-dismiss small-btn large>
    <span slot="button" class="white--text" style="width: 100%">
      <v-icon dark>cci-drone</v-icon>
      {{ deployable.name }}
    </span>

    <span slot="title">
      <v-icon left large dark>cci-drone</v-icon>
      {{ deployable.name }}
    </span>
    <v-chip slot="title-items" color="white" small class="stat-text mr-2 pr-0 mt-4" outlined label>
      DEPLOY&nbsp;
      <v-chip small label :color="`action--${activation.toLowerCase()}`">
        {{ activation.toUpperCase() }}
      </v-chip>
    </v-chip>
    <deployable-info-base :deployable="deployable" />
  </cc-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import deployableInfoBase from './_deployableInfoBase.vue'

export default Vue.extend({
  name: 'deployable-popup',
  components: { deployableInfoBase },
  props: {
    deployable: {
      type: Object,
      required: true,
    },
  },
  computed: {
    activation() {
      return this.deployable.activation ? this.deployable.activation.toLowerCase() : 'quick'
    },
  },
})
</script>
