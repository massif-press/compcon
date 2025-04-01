<template>
  <v-chip v-if="readonly" size="large" variant="tonal" color="secondary" label>
    <v-icon start :icon="getTagIcon" />
    {{ item.Tag ? item.Tag : 'Set NPC Tag' }}
  </v-chip>
  <v-menu v-else offset-y>
    <template #activator="{ props }">
      <v-btn
        flat
        tile
        size="48"
        style="width: auto; margin-left: -1px"
        class="px-4 border-s-sm"
        color="primary"
        v-bind="props">
        <v-icon :icon="getTagIcon" class="mr-2" />
        {{ item.Tag ? item.Tag : 'Set NPC Tag' }}
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-icon v-if="locked" v-bind="props" end>mdi-lock</v-icon>
          </template>
          <span v-if="locked">Locked by template selection ({{ locked }})</span>
        </v-tooltip>
      </v-btn>
    </template>
    <v-card max-width="550px" border tile>
      <v-list lines="two" density="compact" slim>
        <v-list-subheader v-if="locked && locked.length > 0">
          Tag selection limited by template ({{ locked }})
        </v-list-subheader>
        <v-list-subheader v-else>Select NPC Tag</v-list-subheader>
        <v-divider />
        <v-list-item
          v-for="t in tags"
          :title="t.name"
          :subtitle="t.description"
          :prepend-icon="t.icon"
          @click="item.Tag = t.name"
          :disabled="tagDisabled(t)" />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import npcTags from '@/assets/npc_tags.json';

export default {
  name: 'npc-class-selector',
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  computed: {
    locked() {
      let lockTemplate = '';
      if (this.item.NpcClassController) {
        lockTemplate = this.item.NpcClassController.ForceTag;
      }

      if (lockTemplate && lockTemplate.length > 0) {
        return lockTemplate;
      }

      if (this.item.NpcTemplateController) {
        if (this.item.NpcTemplateController.Templates)
          lockTemplate = this.item.NpcTemplateController.Templates.find((t) => t.ForceTag)?.Name;
      }

      return lockTemplate;
    },
    tags() {
      return npcTags;
    },
    getTagIcon() {
      if (!this.item.Tag) return 'mdi-tag-outline';
      const tag = this.tags.find((t) => t.name.toLowerCase() === this.item.Tag.toLowerCase());
      if (!tag) return 'mdi-tag-outline';
      return tag.icon;
    },
  },
  methods: {
    tagDisabled(tag) {
      if (!this.locked) return false;
      return this.locked !== tag.name;
    },
  },
};
</script>
