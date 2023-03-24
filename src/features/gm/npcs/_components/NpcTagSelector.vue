<template>
  <v-col>
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn small variant="outlined" color="protocol" v-bind="props">
          <v-icon small class="mr-1">mdi-tag-outline</v-icon>
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
import npcTags from '@/assets/npc_tags.json';

export default {
  name: 'npc-class-selector',
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    tags() {
      return npcTags;
    },
  },
};
</script>
