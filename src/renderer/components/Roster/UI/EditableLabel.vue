<template>
  <div id="test" @click="startEdit">
    <div v-if="isEditing">
      <b-input>{{val}}</b-input>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'editable-label',
    props: ['val'],
    data: () => ({
      isEditing: false
    }),
    methods: {
      startEdit: function () {
        console.log('!')
        this.isEditing = !this.isEditing
      }
    }
  }
</script>

<style scoped>
  #test:hover {
    background-color: aqua;
    cursor: pointer;
  }
</style>