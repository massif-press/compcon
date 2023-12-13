<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-card
      :elevation="hover ? 12 : 0"
      :outlined="!hover"
      height="100%"
      @click="$emit('open', item.ID)"
    >
      <cc-img :aspect-ratio="1" :src="item.PortraitController.Image">
        <v-fade-transition>
          <div
            v-if="hover"
            class="d-flex text-center primary darken-2 v-card--reveal heading h2 text-white"
            style="height: 100%"
          >
            <v-container v-if="item.NpcClassController.HasClass">
              <v-row density="compact" justify="space-around">
                <v-col cols="auto">
                  <v-icon size="80" color="white">cc:size-{{ item.StatController.Size }}</v-icon>
                </v-col>
              </v-row>
              <v-row density="compact" justify="space-around">
                <v-col v-for="(e, i) in hase">
                  <span style="opacity: 0.5">{{ e.text }}</span>
                  <b v-text="item.StatController[e.val]" />
                </v-col>
              </v-row>
              <v-row density="compact" justify="space-around">
                <v-col v-for="(e, i) in stats" v-show="item.StatController[e.val]" cols="3">
                  <v-icon style="opacity: 0.5" color="white">{{ e.text }}</v-icon>
                  <b v-text="item.StatController[e.val]" />
                </v-col>
              </v-row>
              <div v-show="big">
                <v-divider dark class="my-2" />
                <v-row density="compact" justify="center" align="center" class="text-center">
                  <v-col>
                    <v-chip
                      v-for="(e, i) in item.Items"
                      small
                      label
                      variant="outlined"
                      dark
                      v-text="e.Name"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="item.Subtitle" justify="center" align="end">
                  <v-col class="text-white flavor-text" v-text="item.Subtitle" />
                </v-row>
              </div>
            </v-container>
          </div>
        </v-fade-transition>
      </cc-img>
      <div style="position: absolute; top: 0">
        <v-chip
          small
          label
          :color="hover ? 'accent' : 'primary'"
          class="ma-1"
          v-for="(t, i) in item.NpcTemplateController.Templates"
        >
          <v-icon small>cc:npc_template</v-icon>
          {{ t.Name }}
        </v-chip>
      </div>
      <v-card-text class="pa-0 pb-2 text-center" style="position: relative">
        <div class="text-button" :class="hover ? 'text-accent' : ''">
          <span v-if="item.NpcClassController.Class">
            {{ `T${item.NpcClassController.Tier}` }}
          </span>
          <b v-if="item.NpcClassController.Class" class="px-1">
            {{ item.NpcClassController.Class.Name }}
          </b>
          <span v-if="item.Tag">{{ item.Tag }}</span>
        </div>
        <div class="heading h2" :class="hover ? 'text-accent' : ''">
          {{ item.Name }}
        </div>

        <!-- <v-divider /> -->
        <!-- <v-chip
          small
          :color="hover ? 'accent' : ''"
          v-for="(l, i) in item.Labels"
          
          v-text="l"
        /> -->
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
export default {
  name: 'gm-npc-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
  },
  data: () => ({
    hase: [
      { title: 'H', val: 'Hull' },
      { title: 'A', val: 'Agi' },
      { title: 'S', val: 'Sys' },
      { title: 'E', val: 'Eng' },
    ],
    stats: [
      { title: 'cc:structure', val: 'MaxStructure' },
      { title: 'mdi-shield', val: 'Armor' },
      { title: 'mdi-heart', val: 'MaxHP' },
      { title: 'cc:reactor', val: 'Stress' },
      { title: 'cc:heat', val: 'HeatCapacity' },
      { title: 'mdi-arrow-right-bold-hexagon-outline', val: 'Speed' },
      { title: 'cc:save', val: 'SaveTarget' },
      { title: 'cc:evasion', val: 'Evasion' },
      { title: 'cc:e_def', val: 'EDefense' },
      { title: 'cc:sensor', val: 'SensorRange' },
      { title: 'cc:activate', val: 'Activations' },
    ],
  }),
};
</script>
