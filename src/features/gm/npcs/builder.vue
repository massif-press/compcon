<template>
  <v-container>
    <v-row align="start">
      <v-col cols="auto" class="pa-0">
        <v-icon size="70">{{ item.Icon }}</v-icon>
      </v-col>
      <v-col>
        <div class="heading mech">
          <cc-short-string-editor large :placeholder="item.Name" @set="item.Name = $event">
            <span class="heading-block">
              {{ item.Name }}
            </span>
          </cc-short-string-editor>
        </div>
        <div class="flavor-text mt-2">
          <i v-if="!item.Subtitle" class="text--disabled">Add GM Summary</i>
          <cc-short-string-editor large inline @set="item.Subtitle = $event">
            {{ item.Subtitle }}
          </cc-short-string-editor>
        </div>
      </v-col>
    </v-row>
    <v-row dense align="end">
      <npc-class-selector :item="item" />
      <npc-tag-selector :item="item" />
    </v-row>
    <div v-if="item.NpcClassController.HasClass">
      {{ item.NpcClassController.HasClass }}
      <npc-template-selector :item="item" />
      <v-divider class="my-3" />
      <npc-tier-selector :item="item" />
    </div>
    <npc-stat-editor :item="item" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  NpcClassSelector,
  NpcStatEditor,
  NpcTemplateSelector,
  NpcTierSelector,
  NpcTagSelector,
} from './_components'

export default Vue.extend({
  name: 'npc-builder-content',
  components: {
    NpcClassSelector,
    NpcStatEditor,
    NpcTemplateSelector,
    NpcTierSelector,
    NpcTagSelector,
  },
  props: {
    item: { type: Object, required: true },
  },
})
</script>
