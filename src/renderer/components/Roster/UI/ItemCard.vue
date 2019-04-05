<template>
  <div class="ma-1">
    <v-card flat>
      <v-card-title>
        <strong class="title">{{itemData.name}}</strong>
      </v-card-title>
      <v-card-text class="pb-0 pt-0">

        <div v-if="itemData.data_type === 'weapon'">
          <em v-if="!popup">{{itemData.source}} {{itemData.license}} &mdash; RANK {{itemData.license_level}}</em>
          <p v-if="itemData.type" v-html="itemData.type" />
          <p v-if="itemData.description && !popup" class="blockquote" v-html="itemData.description" />
          <p>{{itemData.mount}} {{itemData.type}}</p>
          <p v-if="itemData.sp" v-html="`${itemData.sp} SP`" />
          <damage-element :dmg="itemData.damage" />
          <range-element :range="itemData.range" />
          <p v-if="itemData.effect" v-html="itemData.effect" />
        </div>

        <div v-else-if="itemData.data_type === 'system' || itemData.data_type === 'mod'">
          <p v-if="!popup">{{itemData.source}} {{itemData.license}} &mdash; RANK {{itemData.license_level}}</p>
          <p v-if="itemData.type" v-html="itemData.type" />
          <p v-if="itemData.description && !popup" class="blockquote" v-html="itemData.description" />
          <p v-if="itemData.sp" v-html="`${itemData.sp} SP`" />
          <p v-if="itemData.effect" v-html="`${itemData.effect}`" />
        </div>

        <!-- frame -->
        <div v-else>
          <b class="ml-3">{{itemData.source}} {{itemData.mechtype}} Frame</b>
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
    props: {
      itemData: Object,
      popup: Boolean
    },
    components: { DamageElement, RangeElement, FrameStatblock, Tag },
    computed: {
      pilot: function () {
        return this.$store.getters.getPilot
      }
    }
  }
</script>
