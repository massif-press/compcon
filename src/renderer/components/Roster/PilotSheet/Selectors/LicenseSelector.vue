<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs3 class="pr-3">
        <div :class="scrollPosition > 200 ? 'scroll-fix' : ''">
        <v-layout>
          <v-flex style="text-align: center">
          <br>
          <h3>Pilot Licenses</h3>
          <hr>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
              <div v-for="license in licenses" :key="`summary_${license.name}`">
                  <v-layout>
                    <v-flex xs12>
                      <strong>{{ license.name }}</strong>
                      <v-icon v-for="n in license.level" :key="license.level + n" small>star</v-icon>
                    </v-flex>
                  </v-layout>
              </div>
          </v-flex> 
        </v-layout>
        <v-layout><v-flex xs12><hr></v-flex></v-layout>
        <v-layout>
          <v-flex xs12>
            <v-alert outline color="success" icon="check_circle" :value="selectionComplete">
              License Selection Complete
            </v-alert>
            <v-alert outline color="warning" icon="priority_high" :value="points.pointsMax > points.pointsCurrent">
              {{points.pointsMax  - points.pointsCurrent}} License Points remaining
            </v-alert>
            <v-btn v-if="!newPilot && !levelUp" block :disabled="!selectionComplete" @click="saveLicenses" color="primary">Save</v-btn>
            <v-btn block flat small :disabled="!licenses.length" @click="resetLicenses">Reset</v-btn>
          </v-flex>
        </v-layout>
        </div>
      </v-flex>


      <v-flex id="list-area">
        <div v-for="m in Object.keys(licenseData)" :key="`summary_block_m${m}`">
          <v-layout>
            <v-flex class="text-xs-center pa-3">
              <span class="display-2 text-uppercase font-weight-light">{{manufacturer(m).name}}</span>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-expansion-panel expand focusable>
                <v-expansion-panel-content v-for="l in licenseData[m]" :key="`${l.license}_data'`" >
                  <v-toolbar-title slot="header">
                  <span>{{l.license.toUpperCase()}}</span>
                  <span v-for="n in playerRank(l.license.toUpperCase())" :key="`${l.license}_plevel_${n}`"><v-icon>star</v-icon></span>
                  </v-toolbar-title>
                  <v-card>
                  <license-selector-item :license="l" :playerRank="playerRank(l.license.toUpperCase())" @add-license="addLicense" @remove-license="removeLicense" :pointLimit="pointLimit" />
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-flex>
          </v-layout>
          <br>
          <v-divider />
        </div>
      </v-flex></v-layout>
  </v-container>
</template>

<script>
  import _ from 'lodash'
  import LicenseSelectorItem from './LicenseSelectorItem'

  function licenseSort (licenses) {
    return licenses.sort(function (a, b) {
      return a.level === b.level ? 0 : a.level > b.level ? -1 : 1
    })
  }

  export default {
    name: 'license-selector',
    props: {
      pilotLicenses: {
        type: Array
      },
      pilotLevel: {
        type: Number
      },
      newPilot: {
        type: Boolean
      },
      levelUp: {
        type: Boolean
      }
    },
    components: { LicenseSelectorItem },
    data: () => ({
      licenses: [],
      pointLimit: false,
      pLevel: 0,
      licenseData: [],
      scrollPosition: null
    }),
    computed: {
      points: function () {
        return {
          pointsCurrent: (this.licenses.reduce((a, b) => +a + +b.level, 0)),
          pointsMax: this.pLevel,
          selectedCurrent: this.licenses.length
        }
      },
      selectionComplete: function () {
        return this.points.pointsCurrent === this.points.pointsMax
      }
    },
    methods: {
      playerRank: function (name) {
        var t = this.licenses.find(x => x.name.toUpperCase() === name)
        return t ? t.level : 0
      },
      manufacturer: function (id) {
        return this.$store.getters.getItemById('Manufacturers', id.toUpperCase())
      },
      addLicense: function (l) {
        var idx = this.licenses.findIndex(x => x.name.toUpperCase() === l.name.toUpperCase())
        if (idx === -1) {
          this.licenses.push({
            name: l.name.toUpperCase(),
            source: l.source.toUpperCase(),
            level: 1
          })
        } else {
          this.licenses[idx].level++
        }
        this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
        this.licenses = licenseSort(this.licenses)

        if (this.levelUp && this.selectionComplete) {
          this.$emit('set-licenses', this.licenses)
          window.scrollTo(0, document.body.scrollHeight)
        }
      },
      removeLicense: function (name) {
        var idx = this.licenses.findIndex(x => x.name === name.toUpperCase())
        if (idx !== -1) {
          this.licenses[idx].level--
          if (this.licenses[idx].level === 0) this.licenses.splice(idx, 1)
        }
        this.pointLimit = false
        this.licenses = licenseSort(this.licenses)
      },
      saveLicenses () {
        this.$emit('set-licenses', this.licenses)
      },
      resetLicenses () {
        this.licenses.splice(0, this.licenses.length)
        this.$forceUpdate()
        this.pointLimit = false
      },
      initialize () {
        this.licenses = licenseSort(JSON.parse(JSON.stringify(this.pilotLicenses)))
      }
    },
    created: function () {
      this.pLevel = this.pilotLevel
      this.licenseData = _.groupBy(this.$store.getters.getItemCollection('Licenses'), 'source')
      this.pointLimit = this.pilotLicenses.reduce((a, b) => +a + +b.level, 0) >= this.points.pointsMax
      this.initialize()
    }
  }
</script>

<style scoped>
  .scroll-fix{
    margin: -25vh 0px;
    position: fixed;
    width: 20vw;
  }

  #list-area {
    width: 80vw!important;
    overflow-y: scroll;
  }
</style>


