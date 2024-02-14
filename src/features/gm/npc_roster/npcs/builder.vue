<template>
  <v-row dense class="heading mech mt-n3" style="min-width: 30vw" align="center">
    <v-col v-if="item.NpcClassController.HasClass" cols="auto">
      <v-icon size="70" :icon="item.NpcClassController.Class.Icon" class="mt-n4" />
    </v-col>
    <v-col>
      <cc-short-string-editor
        large
        justify="start"
        :placeholder="item.Name"
        @set="item.Name = $event">
        <div class="heading-block">
          {{ item.Name }}
        </div>
      </cc-short-string-editor>
    </v-col>
    <v-col cols="auto">
      <span class="text-disabled pr-12">T{{ item.NpcClassController.Tier }}</span>
    </v-col>
  </v-row>
  <div class="pr-12 mt-1">
    <v-textarea
      density="compact"
      variant="outlined"
      label="Summary (GM Only)"
      hide-detail
      rows="1"
      auto-grow
      v-model="item.GmDescription" />
  </div>

  <v-row dense class="mt-n5">
    <v-col>
      <div class="text-caption mb-1">NPC CLASS</div>
      <v-btn
        size="large"
        block
        :color="!item.NpcClassController.HasClass ? 'error' : 'accent'"
        variant="tonal"
        class="px-12"
        @click="($refs.classSelector as any).show()">
        {{
          item.NpcClassController.HasClass ? item.NpcClassController.Class.Name : 'Set NPC Class'
        }}
      </v-btn>
      <npc-class-selector ref="classSelector" :item="item" />
    </v-col>
    <v-col cols="auto">
      <div class="text-caption mb-1">NPC TAG</div>
      <npc-tag-selector :item="item" />
    </v-col>
  </v-row>

  <div v-if="item.NpcClassController.HasClass">
    <npc-template-selector :item="item" />
  </div>
</template>

<script lang="ts">
import {
  NpcClassSelector,
  NpcTemplateSelector,
  NpcTierSelector,
  NpcTagSelector,
} from './_components';

export default {
  name: 'npc-builder-content',
  components: {
    NpcClassSelector,
    NpcTemplateSelector,
    NpcTierSelector,
    NpcTagSelector,
  },
  props: {
    item: { type: Object, required: true },
  },
};
</script>
