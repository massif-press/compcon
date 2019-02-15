<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs3>
        <div id="bonuses-area">
        <v-layout>
          <v-flex style="text-align: center">
          <br>
          <h3>CORE Bonus</h3>
          <hr>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <div v-for="pb in bonuses" :key="`summary_${pb.id}`">
              <v-layout>
                <v-flex xs12>
                  <strong>{{ bonusById(pb).name }}</strong>&nbsp;<span class="caption">({{ bonusById(pb).source }})</span>
                </v-flex>
              </v-layout>
            </div>
          </v-flex> 
        </v-layout>
        <v-layout><v-flex xs12><hr></v-flex></v-layout>
        <v-layout>
          <v-flex xs12>
            <v-alert outline color="success" icon="check_circle" :value="selectionComplete">
              CORE Bonus Selection Complete
            </v-alert>
            <v-alert outline color="warning" icon="priority_high" :value="!pointLimit">
              {{points.pointsCurrent}} / {{points.pointsMax}} CORE Bonuses selected
            </v-alert>
            <v-btn block :disabled="!selectionComplete" @click="saveBonuses">Save</v-btn>
            <v-btn block flat small :disabled="!bonuses.length" @click="resetBonuses">Reset</v-btn>
          </v-flex>
        </v-layout>
        </div>
      </v-flex>

      <v-flex xs10 id="list-area">
        <v-layout v-for="bonus in bonusData" :key="bonus.id" >
          <v-flex>
            <v-toolbar>
              <v-toolbar-title>{{bonus.name}}&nbsp;<span class="caption">{{bonus.source}}</span></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip top :disabled="licenses[bonus.source] > 3 || pointLimit || bonuses.includes(bonus.id)">
                <div slot="activator">
                  <v-btn v-if="bonuses.includes(bonus.id)" fab small @click="removeBonus(bonus.id, bonus.source)"><v-icon>remove</v-icon></v-btn>
                  <v-btn v-else :disabled="pointLimit || licenses[bonus.source] < 3" fab small @click="addBonus(bonus.id, bonus.source)"><v-icon>add</v-icon></v-btn>
                </div>
                <span>{{3 - licenses[bonus.source]}} additional {{bonus.source}} license points required to activate this CORE bonus</span>
              </v-tooltip>
            </v-toolbar>
            <v-card>
              <v-card-title class="pb-0">
                <em v-html="bonus.description" />
              </v-card-title>
              <v-card-text>
                <p v-html="bonus.effect" />
              </v-card-text>
            </v-card>
            <br>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  // to take a CORE bonus in a manufacturer takes 3 license points, per bonus

  export default {
    name: 'core-bonus-selector',
    props: ['pilotBonuses', 'pilotLicenses', 'pilotLevel'],
    data: () => ({
      bonuses: [],
      pointLimit: true,
      licenses: {},
      bonusData: []
    }),
    computed: {
      points: function () {
        return {
          pointsCurrent: this.bonuses.length,
          pointsMax: Math.floor(this.pilotLevel / 3)
        }
      },
      selectionComplete: function () {
        return this.points.pointsCurrent === this.points.pointsMax
      }
    },
    methods: {
      addBonus: function (id, source) {
        this.bonuses.push(id)
        this.licenses[source] -= 3
        console.log(this.licenses)
        this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
      },
      removeBonus: function (id, source) {
        var idx = this.bonuses.findIndex(x => x === id)
        if (idx !== -1) {
          this.bonuses.splice(idx, 1)
          this.licenses[source] += 3
        }
        console.log(this.licenses)
        this.pointLimit = false
      },
      saveBonuses () {
        this.$emit('set-bonuses', this.bonuses)
      },
      resetBonuses () {
        this.bonuses.splice(0, this.bonuses.length)
        this.$forceUpdate()
        this.pointLimit = false
      },
      bonusById: function (id) {
        return this.$store.getters.getItemById('CoreBonuses', id)
      }
    },
    mounted () {
      this.bonuses = JSON.parse(JSON.stringify(this.pilotBonuses))
      var allData = this.$store.getters.getItemCollection('CoreBonuses')
      var licenses = {'GMS': 999}
      for (var i = 0; i < this.pilotLicenses.length; i++) {
        var source = this.pilotLicenses[i].source
        if (licenses[source]) {
          licenses[source]++
        } else {
          licenses[source] = 1
        }
      }
      for (var j = 0; j < this.pilotBonuses.length; j++) {
        licenses[this.$store.getters.getItemById('CoreBonuses', this.pilotBonuses[j]).source] -= 3
      }
      this.licenses = licenses
      this.bonusData = allData.filter(x => licenses[x.source])
    }
  }
</script>

<style>
  #bonuses-area {
    width: 20vw;
    margin: -20px auto 0;
    position: fixed;
  }

  #list-area {
    width: 80vw!important;
  }

  .center-align {
    min-height: 55px;
    display: inline-flex;
    align-items: center;
  }
</style>
