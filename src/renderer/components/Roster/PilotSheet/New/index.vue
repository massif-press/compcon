<template>
  <div class="wrapper">
    <b-container id="content" fluid>
        page 1: create or import
        <br>page 2: name and callsign, image selector
        <br>page 3: background and history
        <br>page 4: skills
        <br>page 5: talents
        <br>page 6: gear
        <br>page 7: confirm
    </b-container>

    <b-container fluid id="footer">
      <b-row class="pad5">
        <b-col>
          <b-progress :value="value" :max="max" ></b-progress>
        </b-col>
      </b-row>
      <b-form-row align-v="end" align-h="center" class="pad5">
        <b-col cols=1>
        <b-btn :to="'/pilot'" variant="warning">Cancel</b-btn>
        </b-col>
        <b-col offset=2>
          <b-button-toolbar>
            <b-button-group>
              <b-btn>&laquo; Back</b-btn>
            </b-button-group>
            &emsp;
            <b-button-group>
              <b-btn>Callsign</b-btn>
              <b-btn>Background</b-btn>
              <b-btn>Skills</b-btn>
              <b-btn>Talents</b-btn>
              <b-btn>Gear</b-btn>
              <b-btn>Finalize</b-btn>
            </b-button-group>
            &emsp;
            <b-button-group>
              <b-btn>Next &raquo;</b-btn>
            </b-button-group>
          </b-button-toolbar>
        </b-col>
      </b-form-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'new-pilot',
    data: () => ({
      value: 1,
      max: 6
    })
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
  width: 100vw;
  height: 90vh;
  background-color: lightgray;
  overflow-y: scroll;
}

#footer {
  position: absolute;
  background-color: cyan;
  bottom: 0;
  width: 100vw;
}
</style>