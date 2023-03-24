<template>
  <page-base :item="item">
    {{ item }}
    {{ typeof item }}
    <v-divider class="my-2" />
    <v-row>
      <v-col>
        <v-btn @click="item.AddCombat()">add combat</v-btn>
      </v-col>
    </v-row>
  </page-base>
</template>

<script lang="ts">
import PageBase from './_components/PageBase.vue';

export default {
  name: 'campaign-beat-page',
  components: { PageBase },
  props: {
    item: { type: Object, required: true },
  },
};
</script>
