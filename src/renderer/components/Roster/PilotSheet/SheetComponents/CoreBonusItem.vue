<template>
  <v-flex>
    <v-card>
      <div v-if="!selectItem">
        <v-toolbar v-if="cb.err" class="mb-2" dense flat >
          <span class="subheading grey--text">// MISSING CORE BONUS DATA //</span>
        </v-toolbar>    
        <v-toolbar dense flat color="grey lighten-2">
          <v-toolbar-title>
            <span>{{cb.name}}&nbsp;</span>
            <span class="caption">{{cb.source}}</span>
          </v-toolbar-title>
        </v-toolbar>
      </div>
      <div class="mb-2" v-if="!cb.err">
        <v-card-title class="pb-0 mb-0 mt-0 pt-2">
          <p class="fluff-text" v-html="cb.description" />
        </v-card-title>
        <v-card-text class="pb-1 mt-0 pt-0">
          <p class="effect-text pb-0" v-html="cb.effect" />
        </v-card-text>
        <v-card-actions v-if="selectItem" class="ml-5 mr-5">
          <v-btn v-if="selectable && !isSelected" large block outline @click="add" color="primary">
            <v-icon>add</v-icon><span v-html="`Add ${cb.name}`" />
          </v-btn>
          <v-btn v-else-if="isSelected" large block @click="remove" color="white">
            <span v-html="`Remove ${cb.name}`" />
          </v-btn>          
        </v-card-actions>
      </div>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'cb-item',
    props: {
      cb: Object,
      selectable: Boolean,
      isSelected: Boolean,
      selectItem: Boolean,
      darken: Boolean
    },
    methods: {
      add () {
        this.$emit('added', this.cb)
      },
      remove () {
        this.$emit('removed', this.cb)
      }
    }
  })
</script>