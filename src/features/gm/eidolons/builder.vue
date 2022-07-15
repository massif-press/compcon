<template>
  <v-container>
    <v-row align="start">
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
    <eidolon-layers />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import EidolonLayers from './_components/EidolonLayers.vue'

export default Vue.extend({
  name: 'eidolon-builder-content',
  components: { EidolonLayers },
  props: {
    item: { type: Object, required: true },
  },
})
</script>
