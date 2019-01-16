<template>
  <div>
    <!-- if !pilot else-->
    <b-container fluid id="test">
      <b-row>
        <b-col cols="5">{{pilot.callsign}}</b-col>
        <b-col cols="2">{{pilot.name}}</b-col>
        <b-col>{{pilot.level}} - {{pilot.background}}</b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col>num</b-col>
        <b-col>num</b-col>
        <b-col>num</b-col>
        <b-col>num</b-col>
        <b-col>num</b-col>
      </b-row>
      <b-row>
        <b-col cols="9">
          history-notes
            
          <br>
          fnf
        </b-col>
        <b-col >
          <b-row >
            <b-img rounded="top" right src="https://via.placeholder.com/300x500"/>
          </b-row>
          <b-row>
            app text
          </b-row>
        </b-col>      
      </b-row>
    <hr>
    <b-row>
      <b-col>l</b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col>s</b-col>
      <b-col>s</b-col>
      <b-col>s</b-col>
      <b-col>s</b-col>
    </b-row>
    <b-row>
      <b-col>tal</b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col>core</b-col>
      <b-col>core</b-col>
      <b-col>core</b-col>
      <b-col>core</b-col>
    </b-row>
    <b-row>
      <b-col>cb</b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col>g</b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col>{{pilot.notes}}</b-col>
    </b-row>

    </b-container>

    <b-container>
      <b-row>
        <b-col><b-button>print</b-button></b-col>
        <b-col><b-button>export</b-button></b-col>
        <b-col><b-button>clone</b-button></b-col>
        <b-col><b-button>delete</b-button></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import EditableTextField from './ui/EditableTextField'
  // import {mapGetters} from 'vuex'

  export default {
    name: 'pilot-sheet',
    components: { EditableTextField },
    props: [
      'pilot_id'
    ],
    computed: {
      pilot: function () {
        return this.$store.getters.getPilot
      }
    }

  }
</script>

<style scoped>
#test {
  background-color:lightskyblue;
}
</style>
