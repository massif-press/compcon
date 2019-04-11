<template>
  <v-container fluid justify-center>
    <v-layout row justify-center class="compendium-header" mt-5 mb-4>
        <h1 class="display-1 font-weight-thin">Compendium</h1>
    </v-layout>
    <v-layout row wrap>
        <v-flex xs12 px-2 pb-3>
            <search-bar />
        </v-flex>
        <v-flex xs6 px-2>
            <v-btn
             to="licenses"
             outline
             flat
             block
             color="green"
             text-uppercase
            >
                licenses
            </v-btn>
        </v-flex>
        <v-flex xs6 px-2>
            <v-btn
             to="manufacturers"
             outline
             flat
             block
             color="green"
             text-uppercase
            >
                manufacturers
            </v-btn>
        </v-flex>
        <v-flex xs3 px-2>
            <v-btn
             to="frames"
             large
             outline
             flat
             block
             color="purple"
             text-uppercase
            >
                frames
            </v-btn>
        </v-flex>
        <v-flex xs3 px-2>
            <v-btn
             to="weapons"
             large
             outline
             flat
             block
             color="pink darken-2"
             text-uppercase
            >
                weapons
            </v-btn>
        </v-flex>
        <v-flex xs3 px-2>
            <v-btn
             to="systems"
             large
             outline
             flat
             block
             color="teal"
             text-uppercase
            >
                systems
            </v-btn>
        </v-flex>
        <v-flex xs3 px-2>
            <v-btn
             to="pilot_gear"
             large
             outline
             flat
             block
             color="primary"
             text-uppercase
            >
                pilot gear
            </v-btn>
        </v-flex>
        <v-flex xs6 px-2>
            <v-btn
             to="statuses"
             outline small
             flat
             block
             color="secondary"
             text-uppercase
            >
                statuses
            </v-btn>
        </v-flex>
        <v-flex xs6 px-2>
            <v-btn
             to="tags"
             outline small
             flat
             block
             color="secondary"
             text-uppercase
            >
                tags
            </v-btn>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchBar from '../SearchBar.vue'

export default Vue.extend({
    name: 'compendium-home',
    components: { SearchBar },
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5em;
}
.compendium-header h1 {
    font-size: 3em !important;
    letter-spacing: 0.2em !important;
    text-align: center;
    text-transform: uppercase;
}
</style>
