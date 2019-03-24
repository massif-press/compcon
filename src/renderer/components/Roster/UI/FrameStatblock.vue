<template>
  <div>
    <div v-if="!hideStatblock">
      <v-card color="grey lighten-3 mt-1 pt-1 pb-1 mb-3">
        <v-layout class="font-weight-bold text-xs-center">
          <v-flex xs2>Size</v-flex>
          <v-flex xs2>Armor</v-flex>
          <v-flex xs2>HP</v-flex>
          <v-flex xs2>Evasion</v-flex>
          <v-flex xs2>E-Defense</v-flex>
          <v-flex xs2>Heat Capacity</v-flex>
          <v-flex xs2>Sensor Range</v-flex>
          <v-flex xs2>Tech Attack</v-flex>
          <v-flex xs2>Save</v-flex>
          <v-flex xs2>Speed</v-flex>
        </v-layout>
      </v-card>
      <v-layout class="text-xs-center mt-1">
        <v-flex xs2>{{frame.stats.size}}</v-flex>
        <v-flex xs2>{{frame.stats.armor}}</v-flex>
        <v-flex xs2>{{frame.stats.hp}}</v-flex>
        <v-flex xs2>{{frame.stats.evasion}}</v-flex>
        <v-flex xs2>{{frame.stats.edef}}</v-flex>
        <v-flex xs2>{{frame.stats.heatcap}}</v-flex>
        <v-flex xs2>{{frame.stats.sensor_range}}</v-flex>
        <v-flex xs2>{{frame.stats.tech_attack}}</v-flex>
        <v-flex xs2>{{frame.stats.save}}</v-flex>
        <v-flex xs2>{{frame.stats.speed}}</v-flex>
      </v-layout>
    </div>
    <v-card color="grey lighten-4"> 
      <v-card-text>
    <v-card>
      <v-card-title class="title mt-0 pt-2 mb-0 pb-0">Mounts</v-card-title>
      <v-card-text class="text-xs-center">
        <v-container>
          <v-layout>
          <v-flex v-for="(t, i) in frame.mounts" :key="t + i"><b class="pt-2 pb-2 pl-5 pr-5 subheading font-weight-black elevation-5">&emsp;{{t}}&emsp;</b></v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card v-if="frame.core_system.integrated">
        <v-card-title class="title mt-0 pt-2 mb-0 pb-0">Integrated Mount</v-card-title>
        <v-card-text class="ml-4">
          <span class="subheading"><b>{{frame.core_system.integrated.name}} ({{frame.core_system.integrated.mount}} {{frame.core_system.integrated.type}}):</b></span> 
          <range-element v-if="frame.core_system.integrated.range" small :range="frame.core_system.integrated.range" />
          <damage-element v-if="frame.core_system.integrated.damage" small size="16" :dmg="frame.core_system.integrated.damage" />
          <br>
          <span v-html="frame.core_system.integrated.effect" />
          <br>
          <tag v-for="tag in frame.core_system.tags" :key="tag" :id="tag" />
        </v-card-text>
      </v-card>
    </v-card>
    <v-card class="m-1">
      <v-card-title class="title mt-0 pt-2 mb-0 pb-0">Traits</v-card-title>
      <v-card-text class="ml-4">
        <span v-for="t in frame.traits" :key="t.name"><b class="subheading font-weight-bold">{{t.name}}:</b> {{t.description}}<br></span>
      </v-card-text>
    </v-card>
    <v-card class="m-1">
      <v-card-title class="title mt-0 pt-2 mb-0 pb-0">CORE System</v-card-title>
      <v-card-text class="ml-4">
        <span><b class="subheading font-weight-bold">{{frame.core_system.name}}:</b> <span v-html="frame.core_system.effect" /></span>
        <span v-if="frame.core_system.passive"><br><span v-html="frame.core_system.passive" /></span>
        <br>
        <tag v-for="tag in frame.core_system.tags" :key="tag" :id="tag" />
      </v-card-text>
    </v-card>
    </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import Tag from './Tag'
  import DamageElement from './DamageElement'
  import RangeElement from './RangeElement'
  
  export default {
    name: 'frame-statblock',
    props: {
      frame: Object,
      hideStatblock: Boolean
    },
    components: { Tag, DamageElement, RangeElement }
  }
</script>
