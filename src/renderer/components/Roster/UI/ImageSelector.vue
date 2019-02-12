<template>
  <div>
    <slot></slot>
    <b-modal ref="myModalRef" size="xl" :title="title" centered>
      <v-container id="gallery">
        <v-layout class="vert-pad">
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>
        </v-layout>
        <v-layout class="vert-pad">
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>
        </v-layout>
        <v-layout class="vert-pad">
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>
          <v-flex xs3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </v-flex>

        </v-layout>
      </v-container>
      <div slot="modal-footer" class="w-100">
        <v-btn size="sm" class="float-right" variant="primary" @click="hideModal()">
          Close
        </v-btn>
      </div>    
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'image-selector-modal',
    props: [
      'title'
    ],
    methods: {
      showModal () {
        this.$refs.myModalRef.show()
      },
      hideModal () {
        this.$refs.myModalRef.hide()
      }
    }
  }
</script>

<style scoped>
 .vert-pad {
   padding: 1.5vh 4vh
 }

 #gallery {
   overflow-y: scroll;
   max-height: 70vh;
 }
</style>
