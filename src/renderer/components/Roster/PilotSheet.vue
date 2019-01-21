<template>
  <div>
    <div v-if="pilot.name">
      <b-container fluid id="test">
        <b-row>
          <b-col cols="auto">
            <editable-label :description="'Callsign'" :attr="'callsign'" :val="pilot.callsign" :id="pilot.id"/>
          </b-col>
          <b-col cols="auto">
            <editable-label :description="'Name'" :attr="'name'" :val="pilot.name" :id="pilot.id"/>
          </b-col>
          <b-col cols="auto">
            <span>//&emsp; Level {{pilot.level}} - {{pilot.background}}</span>
          </b-col>
        </b-row>
        <b-row class="justify-content-md-center">
          <b-col>hp: X </b-col>
          <b-col>armor: X</b-col>
          <b-col>e/e: X</b-col>
          <b-col>speed: X</b-col>
        </b-row>
        <b-row>
          <b-col cols=8>
            <b-row>
              <b-col>
                <b-row><span class="header">hist-header</span></b-row>
                <editable-textfield :description="'History'" :attr="'history'" :val="pilot.history" :id="pilot.id"/>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-row><span class="header">fnf-header</span></b-row>
                <div v-for="(fnf, index) in pilot.fnf" :key="index" class="border rounded" style="padding: 10px; margin:10px">
                  <b-button class="float-right" href="#" variant="danger" size="sm" v-b-tooltip.hover title="Remove Contact"><v-icon name="minus" /></b-button>
                  <h5><editable-label :description="'Contact Name'" :attr="'fnf.name'" :val="fnf.name" :id="pilot.id"/></h5>
                  <em><editable-label :description="'Contact Relationship'" :attr="'fnf.relationship'" :val="fnf.relationship" :id="pilot.id"/></em>
                  <p class="card-text"><editable-label :description="'Contact Description'" :attr="'fnf.description'" :val="fnf.description" :id="pilot.id"/></p>
                </div>
                <b-row>
                  <b-col>
                    <b-btn class="float-right" variant="success" style="margin:0px 10px" v-b-tooltip.hover title="Add Contact"><v-icon name="plus" /></b-btn>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>            
          </b-col>
          <b-col cols=4>
            <b-row><span class="header">appearance-header</span></b-row>
            <b-row>
              <b-col>
                <b-img src="https://via.placeholder.com/400x500" fluid-grow />
              </b-col>
            </b-row>
            <b-row>
              <b-col><editable-textfield :description="'Appearance Notes'" :attr="'text_appearance'" :val="pilot.text_appearance" :id="pilot.id"/></b-col>
            </b-row>
          </b-col>      
        </b-row>
      <b-row><span class="header">licenses-header</span></b-row>
      <b-row>
        <b-col>l</b-col>
      </b-row>
      <b-row><span class="header">stats-header</span></b-row>
      <b-row>
        <b-col>s</b-col>
        <b-col>s</b-col>
        <b-col>s</b-col>
        <b-col>s</b-col>
      </b-row>
      <b-row><span class="header">talents-header</span></b-row>
      <b-row>
        <b-col>tals</b-col>
      </b-row>
      <b-row><span class="header">core-stats-header</span></b-row>
      <b-row>
        <b-col>core</b-col>
        <b-col>core</b-col>
        <b-col>core</b-col>
        <b-col>core</b-col>
      </b-row>
      <b-row><span class="header">core-bonus-header</span></b-row>
      <b-row>
        <b-col>cb</b-col>
      </b-row>
      <b-row><span class="header">gear-header</span></b-row>
      <b-row>
        <b-col>g</b-col>
      </b-row>
      <b-row><span class="header">pilot's notes-header</span></b-row>      
      <b-row>
        <b-col><editable-textfield :description="'Pilot Notes'" :attr="'notes'" :val="pilot.notes" :id="pilot.id"/></b-col>
      </b-row>
      <div class="spacer" />
    </b-container>

      <div class="spacer" />
      <b-container>
        <b-row>
          <b-col><b-button block>print</b-button></b-col>
          <b-col><b-button block>export</b-button></b-col>
          <b-col><b-button block>clone</b-button></b-col>
          <b-col><b-button block>delete</b-button></b-col>
        </b-row>
      <div class="spacer" />

      </b-container>
    </div>
    <div v-else>
      no pilot loaded
    </div>
  </div>
</template>

<script>
  import EditableLabel from './ui/EditableLabel'
  import EditableTextfield from './ui/EditableTextfield'
  // import {mapGetters} from 'vuex'

  export default {
    name: 'pilot-sheet',
    components: { EditableLabel, EditableTextfield },
    props: [
      'pilot_id'
    ],
    methods: {
      appendName: function () {
        this.$store.dispatch('editPilot', {
          id: this.pilot.id,
          attr: 'name',
          val: this.pilot.name + '!'
        })
      }
    },
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

.spacer {
  padding-bottom: 5vh;
}

.header {
  background-color: cadetblue;
  font-weight: bold;
  letter-spacing: 3px;
  width: 100%;
  padding-left: 5px;
  margin-top:10px;
  margin-bottom: 3px;
}

img {
  --notchSize: 20px;
  
  clip-path: 
    polygon(
      0% 0%, 
      0% 0%, 
      calc(100% - var(--notchSize)) 0%, 
      100% var(--notchSize), 
      100% 100%, 
      calc(100% - var(--notchSize)) 100%, 
      var(--notchSize) 100%, 
      0% calc(100% - var(--notchSize))
    );
}

button {
  --notchSize: 8px;
  
  clip-path: 
    polygon(
      0% 0%, 
      0% 0%, 
      calc(100% - var(--notchSize)) 0%, 
      100% var(--notchSize), 
      100% 100%, 
      calc(100% - var(--notchSize)) 100%, 
      var(--notchSize) 100%, 
      0% calc(100% - var(--notchSize))
    );
}

</style>
