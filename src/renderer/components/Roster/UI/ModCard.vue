<template>
  <div class="ma-1">
    <v-card flat color="blue-grey darken-3" class="ma-2">
      <v-card-text class="title text-xs-center pb-1 pt-2">{{modData.name}}<br><span class="caption">WEAPON MODIFICATION</span></v-card-text>
      <v-card-text class="pb-0 pt-0">
        <em>{{modData.source}} {{modData.license}}, RANK <span v-for="n in modData.license_level" :key="n">I</span><br></em>
        <p v-if="modData.description" v-html="modData.description" class="description-text" />
        <p v-if="modData.effect" v-html="modData.effect" class="pl-2"/>
        <v-layout class="mt-2">
          <tag v-for="(tag, index) in modData.tags" :key="tag.id + index" :id="tag.id" :val="tag.val"/>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import Tag from './Tag'

  export default {
    name: 'mod-card',
    props: ['modData'],
    components: { Tag }
  }
</script>

<style>
 .description-text {
   font-weight: 300;
   font-size: 15px;
 }
</style>

