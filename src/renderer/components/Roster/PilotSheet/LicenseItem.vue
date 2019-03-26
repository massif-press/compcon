<template>
  <div>
    <v-layout>
      <v-toolbar dense>
        <v-toolbar-title>
          <span class="caption">{{license.source}}</span> &emsp;
          {{license.name}}
          <v-rating class="d-inline" :value="license.level" :length="3" readonly dense></v-rating>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-dialog lazy v-model="modal" transition="dialog-bottom-transition">
            <v-btn slot="activator" icon>
              <v-icon>launch</v-icon>
            </v-btn>
            <v-toolbar>
              <v-toolbar-title> {{license.source}} &mdash; {{license.name}} </v-toolbar-title>
              <v-spacer />
              <v-toolbar-items>
                <v-btn icon large @click="modal = false"> <v-icon large>close</v-icon> </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card>
              <v-container fluid grid-list-xs>
                <v-card hover class="pb-2">
                  <v-card-title class="pb-0"><span class="headline font-weight-bold">Rank I</span>&emsp;<span class="grey--text"><v-icon color="success">lock_open</v-icon></span></v-card-title>
                  <hr>
                  <v-layout row>
                    <v-flex shrink v-for="item in licenseData.unlocks[0]" :key="item.id">
                      <item-badge :item="item" :locked="false"/>
                    </v-flex>
                  </v-layout>
                </v-card>
                <br>
               <v-card :hover="!isLocked(2)" :color="isLocked(2) ? 'grey lighten-2' : ''" class="pb-2">
                  <v-card-title class="pb-0"><span :class="`headline ${isLocked(2) ? 'grey--text' : 'font-weight-bold'}`">Rank II</span>&emsp;
                    <span v-if="isLocked(2)"><v-icon color="grey">lock</v-icon></span>
                    <span v-else class="grey--text"><v-icon color="success">lock_open</v-icon></span>
                  </v-card-title>
                  <hr>
                  <v-layout row>
                    <v-flex shrink v-for="item in licenseData.unlocks[1]" :key="item.id">
                      <item-badge :item="item" :locked="false"/>
                    </v-flex>
                  </v-layout>
                </v-card>
                <br>
               <v-card :hover="!isLocked(3)" :color="isLocked(3) ? 'grey lighten-2' : ''" class="pb-2">
                  <v-card-title class="pb-0"><span :class="`headline ${isLocked(2) ? 'grey--text' : 'font-weight-bold'}`">Rank III</span>&emsp;
                    <span v-if="isLocked(3)"><v-icon color="grey">lock</v-icon></span>
                    <span v-else class="grey--text"><v-icon color="success">lock_open</v-icon></span>
                  </v-card-title>
                  <hr>
                  <v-layout row>
                    <v-flex shrink v-for="item in licenseData.unlocks[2]" :key="item.id">
                      <item-badge :item="item" :locked="false"/>
                    </v-flex>
                  </v-layout>
                </v-card>                                
              </v-container>
            </v-card>                        
          </v-dialog>
        </v-toolbar-items>
      </v-toolbar>
    </v-layout>
  </div>
</template>

<script>
  import ItemBadge from '../UI/ItemBadge'

  export default {
    name: 'license-item',
    components: { ItemBadge },
    props: {
      license: Object,
      licenseData: Object
    },
    data: () => ({
      modal: false
    }),
    methods: {
      isLocked (target) {
        return !(this.license.level >= target)
      }
    }
  }
</script>
