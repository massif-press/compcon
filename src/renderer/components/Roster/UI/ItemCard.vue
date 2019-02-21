<template>
  <div class="ma-1">
    <v-card flat>
      <v-card-title>
        <strong class="title">{{itemData.name}}</strong>
      </v-card-title>
      <v-card-text class="pb-0 pt-0">
        <p v-if="itemData.type" v-html="itemData.type" />
        <p v-if="itemData.description" v-html="itemData.description" />
        <div v-if="itemData.type === 'weapon'">
          <p>{{itemData.source}} {{itemData.license}} &mdash; RANK {{itemData.license_level}}</p>
          <p>{{itemData.mount}} {{itemData.type}}</p>
          <p v-if="itemData.sp" v-html="`${itemData.sp} SP`" />
          <damage-element :dmg="itemData.damage" />
          <range-element :range="itemData.range" />
          <p v-if="itemData.effect" v-html="itemData.effect" />
        </div>
        <div v-else-if="itemData.type === 'system'">
          <p>{{itemData.source}} {{itemData.license}} &mdash; RANK {{itemData.license_level}}</p>
          <p v-if="itemData.sp" v-html="`${itemData.sp} SP`" />
          <p v-if="itemData.effect" v-html="`${itemData.effect}`" />
        </div>
        <!-- frame -->
        <div v-else>
          <p>{{itemData.source}} {{itemData.mechtype}} Frame</p>
          <p>{{itemData.description}}</p>
          <frame-statblock :frame="itemData" />
        </div>
        <v-layout>
          <tag v-for="tag in itemData.tags" :key="tag.id" :id="tag.id" :val="tag.val"/>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import DamageElement from './DamageElement'
  import RangeElement from './RangeElement'
  import FrameStatblock from './FrameStatblock'
  import Tag from './Tag'

  export default {
    name: 'item-card',
    props: ['itemData'],
    components: { DamageElement, RangeElement, FrameStatblock, Tag },
    computed: {
      pilot: function () {
        return this.$store.getters.getPilot
      }
    }
  }
</script>
