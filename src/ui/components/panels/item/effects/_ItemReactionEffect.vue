<template>
  <effect-base
    :effect="effect"
    :color="color"
    type="REACTION"
    icon="cci-reaction"
    :inset="inset"
    :transparent="transparent"
    :print="print"
  >
    <span :class="print ? 'caption font-weight-bold mt-n2' : 'effect-text mt-n2'">
      {{ effect.Name }}
    </span>
    <cc-slashes />
    <span :class="print ? 'caption mt-n2' : 'flavor-text mt-n2'">{{ effect.Frequency }}</span>
    <div class="mt-n1 ml-2 mb-2">
      <div v-if="effect.Init" class="overline font-weight-bold mb-n2 ml-2 action--reaction--text">
        INIT
      </div>
      <p
        v-if="effect.Init"
        :class="print ? 'overline black--text mt-n1 mb-0' : 'body-text mt-n1 mb-0'"
        v-html="effect.Init"
      />
      <div class="overline mb-n1 font-weight-bold action--reaction--text">TRIGGER</div>
      <p
        :class="print ? 'overline black--text mt-n1 mb-0' : 'body-text mt-n1 mb-0'"
        v-html="effect.Trigger"
      />
      <div class="overline mb-n1 font-weight-bold action--reaction--text">EFFECT</div>
      <p
        :class="print ? 'overline black--text mt-n1 mb-0' : 'body-text mt-n1 mb-1'"
        v-html="effect.Detail"
      />
    </div>
  </effect-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EffectBase from '../_ItemEffectBase.vue'

export default Vue.extend({
  name: 'cc-item-reaction-effect',
  components: { EffectBase },
  props: {
    effect: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'action--reaction',
    },
    inset: { type: Boolean },
    transparent: { type: Boolean },
    print: { type: Boolean },
  },
})
</script>
