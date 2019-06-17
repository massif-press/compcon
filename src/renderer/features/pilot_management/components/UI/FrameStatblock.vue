<template>
  <div>
    <v-card flat color="transparent" class="mb-0 pb-0">
      <v-card-text class="mb-0 pb-0">
        <p class="fluff-text" v-html="frame.description" />
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
          <v-flex xs2>SP</v-flex>
        </v-layout>
      </v-card>
      <v-layout class="text-xs-center effect-text">
        <v-flex xs2>{{ frame.Size }}</v-flex>
        <v-flex xs2>{{ frame.Armor }}</v-flex>
        <v-flex xs2>{{ frame.HP }}</v-flex>
        <v-flex xs2>{{ frame.Evasion }}</v-flex>
        <v-flex xs2>{{ frame.EDefense }}</v-flex>
        <v-flex xs2>{{ frame.HeatCap }}</v-flex>
        <v-flex xs2>{{ frame.SensorRange }}</v-flex>
        <v-flex xs2>{{ frame.TechAttack }}</v-flex>
        <v-flex xs2>{{ frame.Save }}</v-flex>
        <v-flex xs2>{{ frame.Speed }}</v-flex>
        <v-flex xs2>{{ frame.SP }}</v-flex>
      </v-layout>
    </div>
    <v-card color="grey lighten-4">
      <v-layout align-space-between justify-space-around row fill-height>
        <v-flex xs8>
          <v-card-text>
            <v-card flat color="transparent">
              <v-card-title class="title mt-0 pt-2 mb-0 pb-0">
                Mounts
              </v-card-title>
              <v-card-text>
                <b
                  v-for="(t, i) in frame.mounts"
                  :key="t + i"
                  class="title font-weight-black"
                  >
                  &emsp;{{ t }}&emsp;
                  <span
                    v-if="i < frame.mounts.length - 1"
                    class="fluff-text grey--text"
                  >
                    //
                  </span>
                </b>
              </v-card-text>
            </v-card>

            <v-card v-if="frame.CoreSystem.Integrated" flat color="transparent">
              <v-card-title class="title mt-0 pt-2 mb-0 pb-0">
                Integrated Mount
              </v-card-title>
              <v-card-text class="ml-4">
                <span class="subheading">
                  <b>
                    {{ frame.CoreSystem.Integrated.Name }} ({{
                      frame.CoreSystem.Integrated.Size
                    }}
                    {{ frame.CoreSystem.Integrated.Type }}):
                  </b>
                </span>
                <range-element
                  v-if="frame.CoreSystem.Integrated.Range"
                  :range="frame.CoreSystem.Integrated.Range"
                />
                <damage-element
                  v-if="frame.CoreSystem.Integrated.Damage"
                  size="16"
                  :dmg="frame.CoreSystem.Integrated.Damage"
                />
                <br />
                <span
                  v-html="frame.CoreSystem.Integrated.Effect"
                  class="effect-text"
                />
                <br />
                <item-tag
                  v-for="tag in frame.CoreSystem.Tags"
                  :key="tag.id"
                  :tag-obj="tag"
                />
              </v-card-text>
            </v-card>

            <v-card class="m-1" flat color="transparent">
              <v-card-title class="title mt-0 pt-2 mb-0 pb-0">
                Traits
              </v-card-title>
              <v-card-text class="ml-4">
                <span v-for="t in frame.Traits" :key="t.name">
                  <b class="subheading font-weight-bold">{{ t.name }}:</b>
                  &nbsp;
                  <span class="effect-text">{{ t.description }}</span>
                  <br />
                </span>
              </v-card-text>
            </v-card>

            <v-card class="m-1" flat color="transparent">
              <v-card-title class="title mt-0 pt-2 mb-0 pb-0">
                CORE System
              </v-card-title>
              <v-card-text class="ml-4">
                <span>
                  <b class="subheading font-weight-bold">
                    {{ frame.CoreSystem.Name }}:
                  </b>
                </span>
                <span>
                  <br />
                  <span class="effect-text font-weight-bold">Active -</span>
                  <span v-html="frame.CoreSystem.Effect" class="effect-text" />
                </span>
                <br />
                <span v-if="frame.CoreSystem.Passive">
                  <br />
                  <span class="effect-text font-weight-bold">Passive -</span>
                  <span v-html="frame.CoreSystem.Passive" class="effect-text" />
                </span>
                <br />
                <item-tag
                  v-for="tag in frame.CoreSystem.Tags"
                  :key="tag.id"
                  :tag-obj="tag"
                />
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-flex>
        <v-flex>
          <v-img
            :src="frame.DefaultImage"
            class="ma-2"
            contain
            style="top: 50%; left: 50%; transform: translate(-50%,-50%);"
          />
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ItemTag from './ItemTag.vue'
import { getStatic } from '@/mixins/static'
import RangeElement from './RangeElement.vue'
import DamageElement from './DamageElement.vue'

export default Vue.extend({
  name: 'frame-statblock',
  props: {
    frame: Object,
    hideStatblock: Boolean,
  },
  components: { ItemTag, DamageElement, RangeElement },
})
</script>
