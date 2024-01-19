<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-row
      density="compact"
      :class="`elevation-${hover ? '12' : '0'}`"
      :style="`border-radius: 2px; border: ${
        hover ? '1px solid rgb(var(--v-theme-primary))' : ''
      }; background-color: ${odd ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05'}`"
      @click="$emit('open', item.ID)">
      <v-col cols="1">
        <v-card>
          <cc-img :aspect-ratio="1" :src="item.PortraitController.Image" />
        </v-card>
      </v-col>
      <v-col>
        <v-row density="compact">
          <v-col cols="auto">
            <div :class="`heading h3 ${hover ? 'text-accent' : ''}`">
              {{ item.Name }}
              <v-chip v-if="item.NpcClassController.Class" variant="outlined" label small>
                <b>
                  {{ `T${item.NpcClassController.Tier}` }}
                  {{ item.NpcClassController.Class.Name }}
                  {{ item.Tag }}
                </b>
              </v-chip>
            </div>
          </v-col>
          <v-spacer />
          <v-col cols="auto" v-for="(t, i) in item.NpcTemplateController.Templates">
            <v-chip label small :color="hover ? 'accent' : 'primary'" class="ma-1">
              <v-icon icon="cc:npc_template" />
              {{ t.Name }}
            </v-chip>
          </v-col>
        </v-row>
        <div>{{ item.Subtitle }}</div>
        <v-row v-if="item.NpcClassController.Class" density="compact">
          <v-col v-for="(e, i) in hase" cols="auto" class="pr-2">
            <span class="heading h3" style="opacity: 0.5">{{ e.text }}</span>
            <b v-text="item.StatController[e.val]" />
          </v-col>
          <v-col
            v-for="(e, i) in stats"
            v-show="item.StatController[e.val]"
            cols="auto"
            class="pr-2">
            <v-icon style="opacity: 0.5">{{ e.text }}</v-icon>
            <b v-text="item.StatController[e.val]" />
          </v-col>
        </v-row>
        <v-divider class="my-2" />
        <v-row density="compact" justify="center" align="center" class="text-center">
          <v-col>
            <v-chip
              v-for="(e, i) in item.Items"
              small
              label
              variant="outlined"
              class="mx-1"
              v-text="e.Name" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-hover>
</template>

<script lang="ts">
export default {
  name: 'gm-npc-list-item',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
    grouping: { type: Object, required: false, default: '' },
  },
  data: () => ({
    hase: [
      { title: 'H', val: 'Hull' },
      { title: 'A', val: 'Agility' },
      { title: 'S', val: 'Systems' },
      { title: 'E', val: 'Engineering' },
    ],
    stats: [
      { title: 'cc:structure', val: 'Structure' },
      { title: 'mdi-shield', val: 'Armor' },
      { title: 'mdi-heart', val: 'HP' },
      { title: 'cc:reactor', val: 'Stress' },
      { title: 'cc:heat', val: 'Heatcap' },
      { title: 'mdi-arrow-right-bold-hexagon-outline', val: 'Speed' },
      { title: 'cc:save', val: 'Save' },
      { title: 'cc:evasion', val: 'Evasion' },
      { title: 'cc:e_def', val: 'EDefense' },
      { title: 'cc:sensor', val: 'Sensors' },
      { title: 'cc:activate', val: 'Activations' },
    ],
  }),
};
</script>
