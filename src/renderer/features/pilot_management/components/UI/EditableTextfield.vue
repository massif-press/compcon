<template>
<div class="pt-1 pb-1 pl-3 pr-3">
  <v-textarea :dark="dark" :color="dark ? 'warning' : 'primary'"  v-model="newVal" 
    v-on:blur="save" auto-grow rows=1 :label="description" :clearable="clearable">
    {{newVal}}
  </v-textarea>
</div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'editable-textfield',
    props: {
      attr: String,
      description: String,
      initial: String,
      dark: Boolean,
      clearable: Boolean
    },
    data: () => ({
      newVal: ''
    }),
    methods: {
      save () {
        this.$store.dispatch('editPilot', {
          attr: this.attr,
          val: this.newVal
        })
      }
    },
    mounted: function () {
      this.newVal = this.initial
    }
  })
</script>