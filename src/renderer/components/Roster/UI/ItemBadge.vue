<template>
  <div>
    <v-menu :close-on-content-click="false" :nudge-width="200" offset-x >
      <div slot="activator" @click="showCatalogEntry(item)" :id="`itemBadge_${item.id}`">
        <div v-if="item.data_type === 'frame'"><v-btn variant="success" :class="{lockFade: locked}">{{item.name}}</v-btn></div>
        <div v-else-if="item.data_type === 'weapon'"><v-btn variant="warning" :class="{lockFade: locked}">{{item.name}}</v-btn></div>
        <div v-else><v-btn variant="primary" :class="{lockFade: locked}">{{item.name}}</v-btn></div>
      </div>
      <v-card>
        <v-card-title class="pb-0">
        <b>{{item.name}}</b>
        <v-spacer />
          <span v-if="item.data_type === 'frame'">{{item.mechtype}} Frame</span>
          <span v-else-if="item.data_type === 'weapon'">{{item.mount}} {{item.type}}</span>
          <span v-else>System</span>
        </v-card-title>
        <v-divider />
        <v-card-text v-if="item.data_type === 'frame'" class="pt-0">
          statblock
          <br>
          traits
          <br>
          core system
        </v-card-text>
        <v-card-text v-else-if="item.data_type === 'weapon'" class="pt-0">
          {{item.sp || 0}} SP
          <br>
          weapon range
          <br>
          damage
          <br>
          <tag v-for="tag in item.tags" :key="item.id+tag.id" :id="tag.id" :val="tag.val"/>
        </v-card-text>
        <v-card-text v-else class="pt-0">
          {{item.sp || 0}} SP
          <br>
          {{ item.type }}
          <br>
          <tag v-for="tag in item.tags" :key="item.id+tag.id" :id="tag.id" :val="tag.val"/>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  import Tag from './Tag'

  export default {
    name: 'item-badge',
    props: [ 'item', 'locked' ],
    components: { Tag },
    methods: {
      showCatalogEntry (item) {
        console.info('TODO: on click, this should open (or navagate to) the catalog and load the item in question')
      }
    }
  }
</script>

<style scoped>
 .lockFade {
   cursor: not-allowed;
   opacity: 75;
 }
</style>
