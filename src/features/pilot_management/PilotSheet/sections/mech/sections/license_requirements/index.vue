<template>
  <v-col>
    <div class="ml-n3">
      <cc-title small :color="color" class="pl-3 ml-n6"
        >Licenses Required</cc-title
      >
    </div>
    <v-row>
      <v-col>
        <requirement-item
          v-for="(l, index) in mech.RequiredLicenses"
          :key="'req_' + index + mech.MechLoadoutController.ActiveLoadout.ID"
          :license="l"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import RequirementItem from './RequirementItem.vue';

export default {
  name: 'license-requirements-block',
  components: { RequirementItem },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
};
</script>
