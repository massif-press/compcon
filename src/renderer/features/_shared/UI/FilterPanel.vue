<template>
  <div class="text-xs-center">
    <v-bottom-sheet>
      <v-btn slot="activator" color="purple" dark>
        Click me
      </v-btn>
      <v-card flat>
        <v-card-text>
          <v-layout row>
            <v-flex>
              <v-layout row wrap>
                source
              </v-layout>
              <v-layout>
                license
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout row wrap>
                includes tag
              </v-layout>
              <v-layout>
                excludes tag
              </v-layout>
            </v-flex>
            <v-flex>
              for systems
              <v-layout row wrap>
                system type
              </v-layout>
            </v-flex>
            <v-flex>
              for weapons
              <v-layout row wrap>
                attack type
              </v-layout>
              <v-layout row wrap>damage type</v-layout>
              <v-layout row wrap>weapon type</v-layout>
              <v-layout row wrap>size</v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'filter-panel',
  })
</script>