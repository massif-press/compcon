<template>
  <effect-base
    :effect="effect"
    :color="color"
    type="WEAPON EFFECT"
    icon="mdi-sword-cross"
    :inset="inset"
    :transparent="transparent"
    :print="print"
    :class="print ? 'mt-1' : ''"
  >
    <div v-if="effect.OnAttack">
      <span
        :class="print ? 'caption font-weight-bold' : 'heading h3 accent--text'"
        v-html="'On Attack:'"
      />
      <span :class="print ? 'overline' : 'body-text'" v-html="effect.OnAttack" />
    </div>
    <div v-if="effect.OnHit">
      <span
        :class="print ? 'caption font-weight-bold' : 'heading h3 accent--text'"
        v-html="'On Hit:'"
      />
      <span :class="print ? 'overline' : 'body-text'" v-html="effect.OnHit" />
    </div>
    <div v-if="effect.OnCrit">
      <span
        :class="print ? 'caption font-weight-bold' : 'heading h3 accent--text'"
        v-html="'On Critical:'"
      />
      <span :class="print ? 'overline' : 'body-text'" v-html="effect.OnCrit" />
    </div>
    <p v-if="effect.Detail" :class="print ? 'overline' : 'body-text mb-1'" v-html="effect.Detail" />
  </effect-base>
</template>

<script lang="ts">
import Vue from 'vue'
import EffectBase from '../_ItemEffectBase.vue'

export default Vue.extend({
  name: 'cc-item-offensive-effect',
  components: { EffectBase },
  props: {
    effect: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    inset: { type: Boolean },
    transparent: { type: Boolean },
    print: { type: Boolean },
  },
})
</script>
