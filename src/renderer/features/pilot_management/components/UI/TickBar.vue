<template>
  <v-flex shrink>
    <v-rating class="d-inline-block" dense hover v-model="model" :length="max" 
      :small="small" :large="large"
      :empty-icon="emptyIcon" 
      :full-icon="fullIcon"
      :color="color" 
      :background-color="bgColor" 
      :readonly="readonly" />
    <v-tooltip top v-if="!readonly">
      <v-btn slot="activator" small flat icon class="ma-0 pt-0" dark relative style="top:-5px; left: -5px" :color="color" @click="clear">
        <v-icon small>cancel</v-icon>
      </v-btn>
      <span>Clear</span>
    </v-tooltip>
  </v-flex>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'tick-bar',
    props: {
      config_id: String,
      current: Number,
      max: Number,
      attr: String,
      small: Boolean,
      large: Boolean,
      emptyIcon: String,
      fullIcon: String,
      color: String,
      bgColor: String,
      config: Boolean,
      pilot: Boolean,
      readonly: Boolean,
    },
    data: () => ({
      model: 0,
    }),
    methods: {
      clear () {
        this.model = 0
        if (this.config) {
          this.$store.dispatch('editConfig', {
            id: this.config_id,
            attr: this.attr,
            val: 0
          })
        } else if (this.pilot) {
          this.$store.dispatch('editPilot', {
            attr: this.attr,
            val: 0
          })        
        }
        this.$parent.$forceUpdate()
      }
    },
    watch: {
      model (val: number) {
        if (val && !isNaN(val)) {
          if (this.config) {
            this.$store.dispatch('editConfig', {
              id: this.config_id,
              attr: this.attr,
              val: val
            })
          } else if (this.pilot) {
            this.$store.dispatch('editPilot', {
              attr: this.attr,
              val: val
            })           
          }
          this.$parent.$forceUpdate()
        }
      },
    },
    created () {
      if (this.current && !this.readonly) {
        this.model = this.current > this.max ? this.max : this.current
      }
      else if (this.readonly) this.model = this.max
      else this.model = 0  
    }
  })
</script>