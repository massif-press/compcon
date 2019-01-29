<template>
  <div class="wrapper">
    <b-container id="content">
      <transition>
        page 1: create or import
        page 2: name and callsign, image selector
        page 3: background and history
        page 4: skills
        page 5: talents
        page 6: gear
        page 7: confirm
      </transition>
    </b-container>

    <b-container fluid id="footer">
      <div style="padding=5px;">
        <b-progress :value="value" :max="max" ></b-progress>
      </div>
      <div id="cancel-container">
       <b-btn :to="'/roster'" size="sm" variant="danger">Cancel</b-btn>
      </div>
      <b-row align-v="end" align-h="center">
        <div>
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
        </div>
      </b-row>
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

#content {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

#cancel-container{
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>