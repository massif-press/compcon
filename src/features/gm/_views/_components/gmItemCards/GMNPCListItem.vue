<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-row
      dense
      :class="`elevation-${hover ? '12' : '0'}`"
      :style="
        `border-radius: 2px; border: ${
          hover ? '1px solid var(--v-primary-base)' : ''
        }; background-color: ${odd ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05'}`
      "
      @click="$emit('open')"
    >
      <v-col cols="1">
        <v-card>
          <v-img :aspect-ratio="1" :src="item.Image" />
        </v-card>
      </v-col>
      <v-col>
        <v-row dense>
          <v-col cols="auto">
            <div :class="`heading h3 ${hover ? 'accent--text' : ''}`">
              {{ item.Name }}
              <v-chip outlined label small>
                <b>{{ `T${item.Tier}` }} {{ item.Class.Name }} {{ item.Tag }}</b>
              </v-chip>
            </div>
          </v-col>
          <v-spacer />
          <v-col cols="auto" v-for="(t, i) in item.Templates" :key="`${item.ID}_template_${i}`">
            <v-chip label small :color="hover ? 'accent' : 'primary'" class="ma-1">
              <v-icon>cci-npc-template</v-icon>
              {{ t.Name }}
            </v-chip>
          </v-col>
        </v-row>
        <div>{{ item.Subtitle }}</div>
        <v-row dense>
          <v-col v-for="(e, i) in hase" :key="`haseitem_${i}`" cols="auto" class="pr-2">
            <span class="heading h3" style="opacity: 0.5">{{ e.text }}</span>
            <b v-text="item.Stats[e.val]" />
          </v-col>
          <v-col
            v-for="(e, i) in stats"
            :key="`statsitem_${i}`"
            v-show="item.Stats[e.val]"
            cols="auto"
            class="pr-2"
          >
            <v-icon style="opacity: 0.5">{{ e.text }}</v-icon>
            <b v-text="item.Stats[e.val]" />
          </v-col>
        </v-row>
        <v-row dense>
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
      </v-col>
    </v-row>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'gm-npc-list-item',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
    odd: { type: Boolean },
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
  computed: {
    allFactions() {
      if (!this.$store.getters['faction/getFactions']) return []
      return this.$store.getters['faction/getFactions'].filter(x => x.Name !== this.item.Name)
    },
  },
  methods: {
    isLink(name) {
      return this.allFactions.some(x => x.Name === name)
    },
    goTo(name) {
      const e = this.allFactions.find(x => x.Name === name)
      if (!e) return
      this.item.save()
      this.$router.push({ name: `gm-factions-edit`, params: { id: e.ID } })
    },
  },
})
</script>
