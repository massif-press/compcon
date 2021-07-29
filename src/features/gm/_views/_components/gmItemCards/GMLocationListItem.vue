<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-row
      dense
      :class="`elevation-${hover ? '12' : '0'}`"
      @click="$router.push(`locations/edit/${item.ID}`)"
    >
      <v-col cols="1">
        <v-card>
          <v-img :aspect-ratio="1" :src="item.Image" />
        </v-card>
      </v-col>
      <v-col>
        <div :class="`heading h3 ${hover ? 'accent--text' : ''}`">{{ item.Name }}</div>
        <div>{{ item.Description }}</div>
        <div v-if="item.Locations.length" class="overline">SUB-LOCATIONS</div>
        <v-row no-gutters justify="space-between">
          <v-col cols="auto">
            <v-btn
              v-for="(loc, i) in item.Locations"
              small
              text
              :key="`${loc.Name}_${i}`"
              class="mr-2"
            >
              {{ loc.Name }}
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-chip
              v-for="l in item.Labels"
              :key="`${item.ID}_label_${l}`"
              small
              color="primary"
              label
              :outlined="!hover"
              class="mr-2"
            >
              {{ l }}
            </v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'gm-location-list-item',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
  },
})
</script>
