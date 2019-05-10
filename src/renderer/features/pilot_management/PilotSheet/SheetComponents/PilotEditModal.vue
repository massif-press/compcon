<template>
  <v-dialog v-model="model" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-btn v-if="!noActivator" slot="activator" class="edit-btn mlneg" small flat icon color="primary">
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
        <slot v-if="loader" name="modal-content"></slot>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'pilot-edit-modal',
    data: () => ({
      model: false,
      loader: false
    }),
    props: {
      title: String,
      modelRef: Boolean,
      noActivator: Boolean
    },
    methods: {
      cancel () {
        this.$emit('close')
        this.model = false
        this.loader = false
      }
    },
    watch: {
      model: {
        immediate: true, 
        handler (val: boolean) {
          this.model = val
          this.loader = val
        }
      },
      modelRef: {
        immediate: true, 
        handler (val: boolean) {
          this.model = val
          this.loader = val
        }
      }
    },
  })
</script>
