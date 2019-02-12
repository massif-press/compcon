<template>
  <div class="wrapper">
    <b-container id="content" fluid>
      <b-row>
        <b-col>
          1 - 2 - 3 - 4 - 5 - 6 - 7
        </b-col>
      </b-row>
      <b-row>
        <b-col cols=auto><b-btn style="height:100%"><v-icon name="angle-double-left" /></b-btn></b-col>
        <b-col class="scroll">
          <!-- <background-selector @selected="itemSelect" /> -->
          <skill-selector :pilotSkills="newPilot.skills" />
        page 1: create or import
        <br>page 2: name and callsign, image selector
        <br>page 3: background and history
        <br>page 4: skills
        <br>page 5: talents
        <br>page 6: gear
        <br>page 7: confirm
        </b-col>
        <b-col cols=auto><b-btn style="height:100%"><v-icon name="angle-double-right" /></b-btn></b-col>
      </b-row>
    </b-container>

    <b-container fluid id="footer">
      <b-form-row align-v="end" align-h="center" class="pad5">
        <b-col cols=1>
        <b-btn :to="'/pilot'" variant="warning">Cancel</b-btn>
        </b-col>
      </b-form-row>
    </b-container>
  </div>
</template>

<script>
  import BackgroundSelector from '../Selectors/BackgroundSelector'
  import SkillSelector from '../Selectors/SkillSelector'
  export default {
    name: 'new-pilot',
    components: { BackgroundSelector, SkillSelector },
    data: () => ({
      newPilot: {
        background: '',
        skills: []
      },
      value: 1,
      max: 6
    }),
    methods: {
      itemSelect: function (payload) {
        console.log(payload)
      }
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body { 
    font-family: 'Source Sans Pro', sans-serif; 
  }

  .pad5 {
    padding: 5px
  }

#content {
  background-color: lightgray;
}

.scroll {
  height: 92.5vh;
  overflow-y: scroll;
}

#footer {
  position: absolute;
  background-color: transparent;
  bottom: 0;
  width: 100vw;
}
</style>