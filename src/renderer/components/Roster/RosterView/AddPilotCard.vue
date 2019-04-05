<template>
<v-hover>
  <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 0} pb-0`" style="cursor: pointer; background: linear-gradient(rgba(117, 117, 117, 0.5), rgba(0,0,0,0) 90%);" @click="addMenu = true">
    <v-layout row>
      <v-flex class="ma-0 pb-0 pt-0 text-xs-center">
        <div style="height: 300px; display:table; width:100%">
          <span class="pilot-letter white--text">+</span>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex class="pb-0">
        <v-card color="rgba(0, 0, 0, .55)" dark flat height="112px">
          <v-layout fill-height>
            <v-flex class="ma-2 text-xs-center" align-center align-content-center>
              <span class="font-weight-light" style="line-height:76px; letter-spacing:3px; font-size:28px">Add New Pilot</span>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  <add-pilot-menu :dialogModel="addMenu" @close="addMenu = false"/>
  </v-card>
</v-hover>
</template>

<script>
import AddPilotMenu from './AddPilotMenu'

export default {
  name: 'add-pilot-card',
  components: {AddPilotMenu},
  data: () => ({
    addMenu: false
  })
}
</script>

<style>
 .pilot-letter {
   display:table-cell; 
   vertical-align:middle; 
   text-align:center;
   font-size: 20vw;
   line-height: 0;
 }
</style>
