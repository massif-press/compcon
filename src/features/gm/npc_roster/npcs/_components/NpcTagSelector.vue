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
          :key="t.name"
          :title="t.name"
          :subtitle="t.description"
          :prepend-icon="t.icon"
          @click="item.Tag = t.name"
          :disabled="tagDisabled(t)" />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import npcTags from '@/assets/npc_tags.json';

defineOptions({ name: 'npc-class-selector' })

const props = withDefaults(defineProps<{
  item: object
  readonly?: boolean
}>(), {
  readonly: false
})

const locked = computed(() => {
      let lockTemplate = '';
      if (props.item.NpcClassController) {
        lockTemplate = props.item.NpcClassController.ForceTag;
      }

      if (lockTemplate && lockTemplate.length > 0) {
        return lockTemplate;
      }

      if (props.item.NpcTemplateController) {
        if (props.item.NpcTemplateController.Templates)
          lockTemplate = props.item.NpcTemplateController.Templates.find((t) => t.ForceTag)?.Name;
      }

      return lockTemplate;
    })
const tags = computed(() => {
      return npcTags;
    })
const getTagIcon = computed(() => {
      if (!props.item.Tag) return 'mdi-tag-outline';
      const tag = tags.value.find((t) => t.name.toLowerCase() === props.item.Tag.toLowerCase());
      if (!tag) return 'mdi-tag-outline';
      return tag.icon;
    })

function tagDisabled(tag) {
      if (!locked.value) return false;
      return locked.value !== tag.name;
    }
</script>
