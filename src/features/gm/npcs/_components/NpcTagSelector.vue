<template>
  <v-col>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn large block color="protocol" class="white--text" v-on="on">
          {{ item.Tag ? item.Tag : 'Set NPC Tag' }}
        </v-btn>
      </template>
      <v-card max-width="40vw">
        <v-list>
          <v-list-item
            v-for="(t, index) in tags"
            :key="`npc_tag_${index}`"
            three-line
            @click="$set(item, 'Tag', t.name)"
          >
            <v-list-item-content>
              <v-list-item-title class="title">{{ t.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ t.description }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'
import npcTags from '@/assets/npc_tags.json'

export default Vue.extend({
  name: 'npc-class-selector',
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    tags() {
      return npcTags
    },
  },
})
</script>
