<template>
<div class="pt-1 pb-1 pl-3 pr-3">
  <v-textarea v-model="newVal" v-on:blur="save" auto-grow rows=1 :label="description" placeholder="Click to Edit" clearable></v-textarea>
</div>

</template>

<script>
  export default {
    name: 'editable-textfield',
    props: ['attr', 'description', 'initial'],
    data: () => ({
      newVal: ''
    }),
    methods: {
      save: function () {
        this.$store.dispatch('editPilot', {
          attr: this.attr,
          val: this.newVal
        })
      }
    },
    created: function () {
      this.newVal = this.initial
    }
  }
</script>

<style scoped>
  .highlight:hover {
    background-color: aqua;
    cursor: pointer;
  }
</style>