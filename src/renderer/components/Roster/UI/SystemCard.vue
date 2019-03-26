<template>
  <div class="ma-1">
    <v-card flat>
      <v-card-text class="pb-0 pt-0">
        <em v-if="!itemData.license">{{itemData.source}}<br></em>
        <em v-else>{{itemData.source}} {{itemData.license}}, RANK <span v-for="n in itemData.license_level" :key="n">I</span><br></em>
        <p v-if="itemData.description" v-html="itemData.description" class="description-text" />
          <b>{{itemData.type}} ({{itemData.sp}} SP)</b>
        <p v-if="itemData.effect" v-html="itemData.effect" class="pl-2"/>
        <v-layout>
          <tag v-for="tag in itemData.tags" :key="tag.id" :id="tag.id" :val="tag.val"/>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import Tag from './Tag'

  export default {
    name: 'system-card',
    props: {
      itemData: Object
    },
    components: { Tag }
  }
</script>

<style>
 .description-text {
   font-weight: 300;
   font-size: 15px;
 }

 code {
   padding: 4px 12px 4px 12px;
 }
</style>

