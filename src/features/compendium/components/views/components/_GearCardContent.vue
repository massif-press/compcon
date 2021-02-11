<template>
  <c-card-base :item="item" :small="small" :hover="hover">
    <div slot="top">
      <p
        v-if="item.Effect"
        class="card-effect pa-2 mb-1"
        style="font-size: 15px"
        v-html="item.Effect"
      />
      <p
        v-if="item.Description"
        class="card-effect pa-2 mb-1"
        style="font-size: 15px"
        v-html="item.Description"
      />
      <p
        v-if="item.Detail"
        class="card-effect pa-2 mb-1"
        style="font-size: 15px"
        v-html="item.Detail"
      />
      <div>
        <v-row
          no-gutters
          justify="space-around"
          align="center"
          style="max-height: 200px; min-height: 175px"
        >
          <v-col v-if="item.Damage" cols="auto">
            <cc-damage-element :damage="item.Damage" />
          </v-col>
          <v-col v-if="item.Range" cols="auto">
            <cc-range-element :range="item.Range" />
          </v-col>
          <v-col v-if="item.Tags" cols="12" class="text-center pb-2">
            <cc-tags :tags="item.Tags" small dense outlined color="accent" />
          </v-col>
        </v-row>
      </div>
    </div>
  </c-card-base>
</template>

<script lang="ts">
import Vue from 'vue'
import CCardBase from './_cCardBase.vue'
export default Vue.extend({
  name: 'gear-card-content',
  components: { CCardBase },
  props: {
    item: { type: Object, required: true },
    small: { type: Boolean },
    hover: { type: Boolean },
  },
})
</script>

<style scoped>
.card-effect {
  height: 75px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;

  -webkit-line-clamp: 3;
}
</style>
