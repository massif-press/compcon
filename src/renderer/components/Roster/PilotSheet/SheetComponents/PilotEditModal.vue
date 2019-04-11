<template>
  <v-dialog lazy v-model="model" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-btn slot="activator" class="edit-btn mlneg" small flat icon color="primary">
      <v-icon small>edit</v-icon>
    </v-btn>
    <v-card>
      <v-toolbar fixed dense flat>
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon large @click="cancel"><v-icon large>close</v-icon></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-spacer class="mb-5" />
        <slot name="modal-content"></slot>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'pilot-edit-modal',
    data: () => ({
      model: false
    }),
    props: {
      title: String,
      modelRef: Boolean
    },
    methods: {
      cancel () {
        this.model = false
      }
    },
    watch: {
      modelRef: function (val) {
        this.model = val
      },
    }
  })
</script>
