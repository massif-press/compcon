<template>
  <v-hover v-slot="{ hover }" style="cursor: pointer">
    <v-row dense :class="`elevation-${hover ? '12' : '0'}`" @click="$emit('open')">
      <v-col cols="1">
        <v-card>
          <v-img :aspect-ratio="1" :src="item.Image" />
        </v-card>
      </v-col>
      <v-col>
        <div :class="`heading h3 ${hover ? 'accent--text' : ''}`">{{ item.Name }}</div>
        <div>{{ item.Description }}</div>
        <div v-if="item.Factions.length" class="overline">RELATED ORGANIZATIONS</div>
        <v-row no-gutters justify="space-between">
          <v-col cols="auto">
            <v-btn
              v-for="(f, i) in item.Factions"
              small
              outlined
              :key="`${f.name}_${i}`"
              class="mr-2"
              :disabled="!isLink(f.name)"
              @click.stop="goTo(f.name)"
            >
              {{ f.name }}
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
  name: 'gm-faction-list-item',
  props: {
    item: { type: Object, required: true },
    big: { type: Boolean },
  },
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
