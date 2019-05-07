<template>
  <div>
    <v-card flat color="transparent" class="mb-0 pb-0">
      <v-card-text class="mb-0 pb-0">
        <p class="fluff-text" v-html="frame.description"/>
      </v-card-text>
    </v-card>
    <div v-if="!hideStatblock">
      <v-card color="grey lighten-3 mt-1 pt-1" flat>
        <v-layout class="font-weight-bold text-xs-center effect-text">
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
      <v-layout class="text-xs-center effect-text">
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
      <v-layout align-space-between justify-space-around row fill-height>
        <v-flex xs8>
          <v-card-text>

            <v-card flat color="transparent">
              <v-card-title class="title mt-0 pt-2 mb-0 pb-0">Mounts</v-card-title>
              <v-card-text>
                <b v-for="(t, i) in frame.mounts" :key="t + i" class="title font-weight-black ">
                  &emsp;{{t}}&emsp;
                  <span v-if="i < frame.mounts.length - 1" class="fluff-text grey--text">//</span>
                </b>
              </v-card-text>
            </v-card>

            <v-card v-if="frame.core_system.integrated" flat color="transparent">
              <v-card-title class="title mt-0 pt-2 mb-0 pb-0">Integrated Mount</v-card-title>
              <v-card-text class="ml-4">
                <span class="subheading">
                  <b>{{frame.core_system.integrated.name}} ({{frame.core_system.integrated.mount}} {{frame.core_system.integrated.type}}):</b>
                </span> 
                <range-element v-if="frame.core_system.integrated.range" :range="frame.core_system.integrated.range" />
                <damage-element v-if="frame.core_system.integrated.damage" size="16" :dmg="frame.core_system.integrated.damage" />
                <br>
                <span v-html="frame.core_system.integrated.effect" class="effect-text" />
                <br>
                <item-tag v-for="tag in frame.core_system.tags" :key="tag.id" :tag-obj="tag" />
              </v-card-text>
            </v-card>

            <v-card class="m-1" flat color="transparent">
              <v-card-title class="title mt-0 pt-2 mb-0 pb-0">Traits</v-card-title>
              <v-card-text class="ml-4">
                <span v-for="t in frame.traits" :key="t.name">
                  <b class="subheading font-weight-bold">{{t.name}}:</b>&nbsp;<span class="effect-text">{{t.description}}</span>
                  <br>
                </span>
              </v-card-text>
            </v-card>

            <v-card class="m-1" flat color="transparent">
              <v-card-title class="title mt-0 pt-2 mb-0 pb-0">CORE System</v-card-title>
              <v-card-text class="ml-4">
                <span>
                  <b class="subheading font-weight-bold">{{frame.core_system.name}}:</b> 
                  <span v-html="frame.core_system.effect" class="effect-text"/>
                </span>
                <span v-if="frame.core_system.passive">
                  <br>
                  <span v-html="frame.core_system.passive" class="effect-text"/>
                </span>
                <br>
                <item-tag v-for="tag in frame.core_system.tags" :key="tag.id" :tag-obj="tag" />
              </v-card-text>
            </v-card>
        </v-card-text>
        </v-flex>
        <v-flex>
           <v-img :src="`file://${userDataPath}/img/default_frames/${frame.id}.png`" class="ma-2" contain
            style="top: 50%; left: 50%; transform: translate(-50%,-50%);"/>
        </v-flex>
      </v-layout>

    </v-card>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import ItemTag from './ItemTag.vue'
  import {getStatic} from '@/mixins/static'
  import RangeElement from './RangeElement.vue'
  import DamageElement from './DamageElement.vue'

  export default Vue.extend({
    name: 'frame-statblock',
    props: {
      frame: Object,
      hideStatblock: Boolean,
    },
    components: { ItemTag, DamageElement, RangeElement },
    methods: {
      getStaticPath (path: string) {
        return getStatic(path)
      },
    }
  })
</script>
