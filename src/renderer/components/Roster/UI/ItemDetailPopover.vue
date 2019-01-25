<template>
  <b-popover :target="target" triggers="hover focus">
    <template slot="title">
      <b>{{item.name}}</b>
      <br>
      <div v-if="item.data_type === 'frame'">
        <span>{{item.mechtype}} Frame</span>
      </div>
      <div v-else-if="item.data_type === 'weapon'">
        <span>{{item.mount}} {{item.type}}</span>
      </div>
      <div v-else>
        <span>System</span>
      </div>
    </template>
      <div v-if="item.data_type === 'frame'">
        statblock
        <br>
        traits
        <br>
        core system
      </div>
      <div v-else-if="item.data_type === 'weapon'">
        {{item.sp || 0}} SP
        <br>
        weapon range
        <br>
        damage
        <br>
        <b-badge v-for="tag in item.tags" :key="item.id+tag.id">{{tag.id}}</b-badge>
      </div>
      <div v-else>
        {{item.sp || 0}} SP
        <br>
        {{ item.type }}
        <br>
        <b-badge v-for="tag in item.tags" :key="item.id+tag.id"> {{tag.id}} </b-badge>
      </div>
  </b-popover>
</template>

<script>
  export default {
    name: 'item-detail-popover',
    props: [ 'item', 'target' ]
  }
</script>

