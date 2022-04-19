<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-card
      :elevation="hover ? 12 : 0"
      :outlined="!hover"
      height="100%"
      @click="$emit('open', item.ID)"
    >
      <v-img :aspect-ratio="1" :src="item.PortraitController.Image">
        <v-fade-transition>
          <div
            v-if="hover"
            class="d-flex text-center primary darken-2 v-card--reveal heading h2 white--text"
            style="height: 100%"
          >
            <v-container v-if="item.NpcClassController.Class">
              <v-row dense justify="space-around">
                <v-col cols="auto">
                  <v-icon size="80" color="white">cci-size-{{ item.Stats.Size }}</v-icon>
                </v-col>
              </v-row>
              <v-row dense justify="space-around">
                <v-col v-for="(e, i) in hase" :key="`haseitem_${i}`">
                  <span style="opacity: 0.5">{{ e.text }}</span>
                  <b v-text="item.Stats[e.val]" />
                </v-col>
              </v-row>
              <v-row dense justify="space-around">
                <v-col
                  v-for="(e, i) in stats"
                  :key="`statsitem_${i}`"
                  v-show="item.Stats[e.val]"
                  cols="3"
                >
                  <v-icon style="opacity: 0.5" color="white">{{ e.text }}</v-icon>
                  <b v-text="item.Stats[e.val]" />
                </v-col>
              </v-row>
              <div v-show="big">
                <v-divider dark class="my-2" />
                <v-row dense justify="center" align="center" class="text-center">
                  <v-col>
                    <v-chip
                      v-for="(e, i) in item.Items"
                      :key="`npc_item_${i}`"
                      small
                      label
                      outlined
                      dark
                      v-text="e.Name"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="item.Subtitle" justify="center" align="end">
                  <v-col class="white--text flavor-text" v-text="item.Subtitle" />
                </v-row>
              </div>
            </v-container>
          </div>
        </v-fade-transition>
      </v-img>
      <div style="position: absolute; top: 0">
        <v-chip
          small
          label
          :color="hover ? 'accent' : 'primary'"
          class="ma-1"
          v-for="(t, i) in item.NpcTemplateController.Templates"
          :key="`${item.ID}_template_${i}`"
        >
          <v-icon small>cci-npc-template</v-icon>
          {{ t.Name }}
        </v-chip>
      </div>
      <v-card-text class="pa-0 pb-2 text-center" style="position: relative">
        <div class="text-button" :class="hover ? 'accent--text' : ''">
          <span v-if="item.NpcClassController.Class">
            {{ `T${item.NpcClassController.Tier}` }}
          </span>
          <b v-if="item.NpcClassController.Class" class="px-1">
            {{ item.NpcClassController.Class.Name }}
          </b>
          <span v-if="item.Tag">{{ item.Tag }}</span>
        </div>
        <div class="heading h2" :class="hover ? 'accent--text' : ''">{{ item.Name }}</div>

        <!-- <v-divider /> -->
        <!-- <v-chip
          small
          :color="hover ? 'accent' : ''"
          v-for="(l, i) in item.Labels"
          :key="`${item.ID}_label_${i}`"
          v-text="l"
        /> -->
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'gm-npc-card',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
  },
  data: () => ({
    hase: [
      { text: 'H', val: 'Hull' },
      { text: 'A', val: 'Agility' },
      { text: 'S', val: 'Systems' },
      { text: 'E', val: 'Engineering' },
    ],
    stats: [
      { text: 'cci-structure', val: 'Structure' },
      { text: 'mdi-shield', val: 'Armor' },
      { text: 'mdi-heart', val: 'HP' },
      { text: 'cci-reactor', val: 'Stress' },
      { text: 'cci-heat', val: 'Heatcap' },
      { text: 'mdi-arrow-right-bold-hexagon-outline', val: 'Speed' },
      { text: 'cci-save', val: 'Save' },
      { text: 'cci-evasion', val: 'Evasion' },
      { text: 'cci-edef', val: 'EDefense' },
      { text: 'cci-sensor', val: 'Sensors' },
      { text: 'cci-activate', val: 'Activations' },
    ],
  }),
})
</script>
