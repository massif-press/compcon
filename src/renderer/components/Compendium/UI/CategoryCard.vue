<template>
  <v-flex grow>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 8 : 3}`" :to="loc" height="15vw">
        <v-card-text class="text-xs-center">
          <v-icon size="5em" :color="color + (hover ? 'lighten-2' : '' )">{{icon}}</v-icon>
        </v-card-text>
        <v-card-actions>
          &nbsp;
          <v-spacer />
          <span class="title font-weight-light"> {{name}} </span>
          <v-spacer />
          &nbsp;
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'category-card',
  props: {
    icon: String,
    color: String,
    name: String,
    loc: String
  }
})
</script>

