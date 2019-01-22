<template>
  <div>
    <slot></slot>
    <b-modal ref="myModalRef" size="xl" :title="title" centered>
      <b-container id="gallery">
        <b-row class="vert-pad">
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>
        </b-row>
        <b-row class="vert-pad">
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>
        </b-row>
        <b-row class="vert-pad">
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>
          <b-col cols=3> <b-img center blank width="225" height="225" blank-color="#777" thumbnail/> </b-col>

        </b-row>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-btn size="sm" class="float-right" variant="primary" @click="hideModal()">
          Close
        </b-btn>
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
