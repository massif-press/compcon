<template>
  <v-row dense
    class="heading h1 mt-n4"
    align="center">
    <cc-remote-hover :item="item" />

    <v-col>
      <cc-short-string-editor large
        justify="start"
        :placeholder="item.Name"
        :readonly="readonly"
        @set="item.Name = $event">
        <div style="line-height: 0.9em">
          {{ item.Name }}
        </div>
      </cc-short-string-editor>
    </v-col>
    <v-col cols="auto">
      <span class="text-disabled pr-6">T{{ item.NpcClassController?.Tier || '' }}</span>
    </v-col>
  </v-row>
  <div v-if="!item.IsNameless"
    class="heading h4 text-disabled mb-2 mt-n2"
    style="letter-spacing: 3px">
    {{ item.DefaultName }}
  </div>

  <v-row no-gutters
    class="mb-4">
    <v-col>
      <div class="text-cc-overline mt-1">NPC CLASS</div>
      <div v-if="readonly"
        class="heading h2 ml-2 mt-n2 text-accent">
        {{
          item.NpcClassController?.HasClass ? item.NpcClassController.Class.Name : 'No NPC Class'
        }}
      </div>
      <div v-else>
        <cc-modal title="select NPC class"
          fullscreen
          icon="cc:encounter">
          <template #activator="{ open }">
            <cc-button block
              :prepend-icon="item.NpcClassController.Class?.Icon || undefined"
              :color="!item.NpcClassController?.HasClass ? 'error' : 'primary'"
              @click="open">
              {{
                item.NpcClassController?.HasClass
                  ? item.NpcClassController.Class.Name
                  : 'Set NPC Class'
              }}
            </cc-button>
          </template>
          <template #default="{ close }">
            <npc-class-selector :item="item"
              @close="close" />
          </template>
        </cc-modal>
      </div>
    </v-col>

    <v-col cols="auto">
      <div class="text-cc-overline mt-1">NPC TAG</div>
      <npc-tag-selector :readonly="readonly"
        :item="item" />
    </v-col>
  </v-row>

  <div v-if="item.NpcClassController?.HasClass"
    class="mb-4">
    <div class="text-cc-overline">TEMPLATES</div>
    <npc-template-selector :readonly="readonly"
      :item="item" />
  </div>
</template>

<script lang="ts">
import {
  NpcClassSelector,
  NpcTemplateSelector,
  NpcTagSelector,
} from './_components';
import { npcClassSelectorMixin } from './_components/_npcClassSelectorMixin';

export default {
  name: 'NpcBuilderContent',
  mixins: [npcClassSelectorMixin],
  components: {
    NpcClassSelector,
    NpcTemplateSelector,
    NpcTagSelector,
  },
  props: {
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
  },
  methods: {
    equip(item) {
      this.item.NpcClassController.SetClass(item, this.item.NpcClassController.Tier);
      (this.$refs.classSelector as any).hide();
    },
  },
};
</script>
