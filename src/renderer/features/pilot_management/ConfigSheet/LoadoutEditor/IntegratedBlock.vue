<template>
  <div>
    <v-card class="mb-2 pr-5 pl-0 pb-4" color="grey darken-2">
      <span class="mount-title pl-3 pr-3 text-uppercase">{{source}} Integrated Mount</span>
      <v-card-text class="bordered ml-3 pt-4">
        <v-layout fill-height>
          <v-flex xs2>
            <v-btn :ripple="false" color="blue-grey darken-2" block 
              class="ma-0 pa-0" style="height:100%">Integrated Weapon</v-btn>
          </v-flex>
          <v-flex xs10>
            <v-expansion-panel class="m-0">
              <v-expansion-panel-content>
                <v-layout slot="header"> 
                  <span class="subheading font-weight-bold">{{item.name}}</span> 
                  <v-spacer />
                  <span class="mr-5" style="display: inline-flex;">
                    <range-element v-if="item.range" dark small :range="item.range" />
                    <span v-if="item.range && item.damage">&emsp;&mdash;&emsp;</span>
                    <damage-element v-if="item.damage" dark small size="16" :dmg="item.damage" />
                  </span>
                </v-layout>
                <div class="ma-1">
                  <v-card flat color="#373737">
                    <v-card-text class="pb-0 pt-0">
                      <p v-if="item.description" v-html="item.description" class="fluff-text" />
                      <b>{{item.mount}} {{item.type}}</b>
                      <br>
                      <damage-element v-if="item.damage" dark :dmg="item.damage" />
                      <range-element v-if="item.range" :range="item.range" />
                      <p v-if="item.effect" v-html="item.effect" class="pl-2 effect-text"/>
                      <v-layout class="mt-2">
                        <item-tag v-for="(tag, index) in item.tags" :key="tag.id + index" :tag-obj="tag"/>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>  
          </v-flex>
        </v-layout>    
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {RangeElement, DamageElement, ItemTag} from '../../components/UI'

  export default Vue.extend({  
    name: 'integrated-block',
    props: {
      item: Object,
      source: String
    },
    components: { ItemTag, RangeElement, DamageElement }
  })
</script>
