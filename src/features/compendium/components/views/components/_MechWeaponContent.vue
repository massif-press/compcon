<template>
  <c-card-base :item="item" :small="small" :highlighted="highlighted" :hover="hover">
    <template #top>
      <v-row no-gutters justify="space-around" align="center" class="text-text">
        <v-col v-if="item.Damage && item.Damage[0]" cols="auto">
          <cc-damage-element :damage="item.Damage" />
        </v-col>
        <v-col v-if="item.Range" cols="auto">
          <cc-range-element :range="item.Range" />
        </v-col>
      </v-row>
    </template>
    <template #overline>{{ item.Size }} {{ item.WeaponTypes.join('/') }}</template>
  </c-card-base>
</template>

<script lang="ts">
import CCardBase from './_cCardBase.vue';
export default {
  name: 'weapon-card-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
    highlighted: { type: Boolean },
  },
};
</script>
