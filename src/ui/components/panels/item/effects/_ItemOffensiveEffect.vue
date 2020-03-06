<template>
  <v-row dense :class="`body-text pa-1 ${inset ? 'item-panel-inset' : transparent ? '' : 'light-panel clipped'}`">
    <v-col cols="auto">
      <v-icon x-large :color="color">
        mdi-sword-cross
      </v-icon>
    </v-col>
    <v-col class="mt-n3">
      <div
        class="overline primary--text mb-n1 mt-1"
        v-html="effect.OnAttack || effect.OnHit || effect.OnCrit ? 'ATTACK EFFECT' : 'EFFECT'"
      />
      <div v-if="effect.OnAttack">
        <span class="heading h3 primary--text" v-html="'On Attack:'" />
        <span class="body-text" v-html="effect.OnAttack" />
      </div>
      <div v-if="effect.OnHit">
        <span class="heading h3 primary--text" v-html="'On Hit:'" />
        <span class="body-text" v-html="effect.OnHit" />
      </div>
      <div v-if="effect.OnCrit">
        <span class="heading h3 primary--text" v-html="'On Critical:'" />
        <span class="body-text" v-html="effect.OnCrit" />
      </div>
      <p v-if="effect.Detail" class="body-text mb-1" v-html="effect.Detail" />
      <cc-item-effect-panel v-if="effect.Abilities" :effects="effect.Abilities" inset />
      <cc-tags v-if="effect.Tags" :tags="effect.Tags" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-offensive-effect',
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
    inset: {
      type: Boolean,
    }, transparent: { type: Boolean }
  },
})
</script>
