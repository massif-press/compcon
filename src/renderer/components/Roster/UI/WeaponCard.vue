<template>
  <div class="ma-1">
    <v-card flat>
      <v-card-text class="pb-0 pt-0">
        <em v-if="!itemData.license">{{itemData.source}}<br></em>
        <em v-else>{{itemData.source}} {{itemData.license}}, RANK <span v-for="n in itemData.license_level" :key="n">I</span><br></em>
        <p v-if="itemData.description" v-html="itemData.description" class="description-text" />
        <p v-if="itemData.effect" v-html="itemData.effect" class="pt-1 pl-2 pr-2 subheading font-weight-bold"/>
        <b>{{itemData.mount}} {{itemData.type}} <span v-if="itemData.sp">({{itemData.sp}} SP)</span></b>
        <br>
        <damage-element dark :dmg="itemData.damage" />
        <range-element :range="itemData.range" :neurolinked="hasNeurolinked" />
        <v-layout class="mt-2">
          <tag v-for="(tag, index) in itemData.tags" :key="tag.id + index" :id="tag.id" :val="tag.val"/>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import Tag from './Tag'
  import DamageElement from './DamageElement'
  import RangeElement from './RangeElement'

  export default {
    name: 'system-card',
    props: ['itemData'],
    components: { Tag, RangeElement, DamageElement },
    computed: {
      hasNeurolinked: function () {
        return this.$store.getters.getPilot.core_bonuses.includes('neurolinked')
      }
    }
  }
</script>

<style>
 .description-text {
   font-weight: 300;
   font-size: 15px;
 }
</style>

