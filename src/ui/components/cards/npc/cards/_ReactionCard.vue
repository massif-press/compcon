<template>
  <card-base
    :item="item"
    :active="active"
    :readonly="readonly"
    @remove-feature="$emit('remove-feature', $event)"
    @recalc="$emit('recalc')"
  >
    <span v-if="item.Feature.Trigger" class="overline">TRIGGER</span>
    <p v-html-safe="item.Feature.Trigger" class="panel body-1 mb-0" />
    <span class="overline">EFFECT</span>
    <p v-if="item.Tier" v-html-safe="item.Feature.EffectByTier(item.Tier)" class="body-1 mb-0" />
    <p v-else v-html-safe="item.Feature.Effect" class="body-1 mb-0" />
    <v-col slot="extra-action" cols="auto" class="mx-2">
      <cc-tooltip simple :content="`Stage Reaction: ${item.Name}`">
        <v-btn outlined small color="action--reaction" @click="$emit('add-reaction', item.Name)">
          <v-icon>mdi-plus</v-icon>
          <v-icon>cci-reaction</v-icon>
        </v-btn>
      </cc-tooltip>
    </v-col>
    <cc-tags v-if="item.Feature.Tags" :tags="item.Feature.Tags" small />
  </card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import CardBase from './_CardBase.vue'

export default Vue.extend({
  name: 'npc-trait-card',
  components: { CardBase },
  props: {
    item: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
  },
})
</script>
