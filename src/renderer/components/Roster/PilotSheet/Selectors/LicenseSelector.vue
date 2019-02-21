<template>
  <v-container fluid>
    <br><br>
    <v-layout>
      <v-flex xs3>
        <div id="licenses-area">
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
            <v-btn v-if="!newPilot" block :disabled="!selectionComplete" @click="saveLicenses">Save</v-btn>
            <v-btn block flat small :disabled="!licenses.length" @click="resetLicenses">Reset</v-btn>
          </v-flex>
        </v-layout>
        </div>
      </v-flex>


      <v-flex id="list-area">
  <v-expansion-panel expand focusable>
    <v-expansion-panel-content v-for="l in licenseData" :key="`${l.license}_data'`" >
      <v-toolbar-title slot="header">
      <span>{{l.license.toUpperCase()}}</span>
      <span v-for="n in playerRank(l.license.toUpperCase())" :key="`${l.license}_plevel_${n}`"><v-icon>star</v-icon></span>
      </v-toolbar-title>
      <v-card>
      <license-selector-item :license="l" :playerRank="playerRank(l.license.toUpperCase())" @add-license="addLicense" @remove-license="removeLicense" :pointLimit="pointLimit" />
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
      </v-flex></v-layout>
  </v-container>
</template>

<script>
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
      }
    },
    components: { LicenseSelectorItem },
    data: () => ({
      licenses: [],
      pointLimit: false,
      pLevel: 0,
      licenseData: []
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
      init () {
        this.licenses = licenseSort(JSON.parse(JSON.stringify(this.pilotLicenses)))
      }
    },
    mounted () {
      this.pLevel = this.pilotLevel
      this.licenseData = this.$store.getters.getItemCollection('Licenses')
      this.init()
    }
  }
</script>

<style>
  #licenses-area {
    width: 18vw!important;
    margin: -20px auto 0;
    position: fixed;
  }

  #list-area {
    width: 80vw!important;
    overflow-y: scroll;
  }
</style>


