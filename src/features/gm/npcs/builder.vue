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
          <cc-short-string-editor large :placeholder="item.Subtitle" @set="item.Subtitle = $event">
            <b v-if="item.Subtitle" class="heading-block stark--text" v-html="item.Subtitle" />
            <i v-else class="heading-block subtle--text" v-html="'Add GM Summary'" />
          </cc-short-string-editor>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <npc-class-selector :item="item" />
      <npc-tag-selector :item="item" />
    </v-row>
    <div v-if="item.Class">
      <npc-template-selector :item="item" />
      <v-divider class="my-3" />
      <npc-tier-selector :item="item" />
      <npc-stat-editor :item="item" />
    </div>
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
