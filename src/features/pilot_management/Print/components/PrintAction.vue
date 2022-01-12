<template>
  <div>
    <div v-for="a in actions" :key="`action_${a.ID}`">
      <div class="my-n1">
        <v-icon small v-html="a.Icon" />
        <span class="caption">
          <b>{{ a.Name }}</b>
          ({{ a.Activation }})
        </span>
      </div>
      <div class="ml-3">
        <div v-if="a.Init" v-html-safe="a.Init" class="caption" />
        <div v-if="a.Trigger">
          <div class=" overline my-n2">Trigger</div>
          <div v-html-safe="a.Trigger" class="caption " />
        </div>
        <div v-if="a.Detail">
          <div class="overline my-n2">Effect</div>
          <div v-html-safe="a.Detail" class="caption " />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'print-action',
  props: {
    actions: {
      type: Array,
      required: true,
    },
  },
})
</script>
