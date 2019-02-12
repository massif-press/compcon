<template>
  <v-expansion-panel-content>
    <div slot="header">{{talent.rank}} - {{talentData.name}}</div>
    <v-card>
      <v-card-text>{{talentData.description}}</v-card-text>
    </v-card>
    <v-card color="blue lighten-5">
      <v-card-title primary-title>
        <div>
          <div class="title"><v-icon class="mb-1">star</v-icon> {{talentData.r1_name}}</div>
          <p class="pl-4" v-html="talentData.r1_desc" />
        </div>
      </v-card-title>
    </v-card>
    <v-card :color="isLocked(2) ? 'grey lighten-1' : 'blue lighten-5'">
      <v-card-title primary-title>
        <div>
          <div class="title">
            <span v-if="isLocked(2)">
              <v-icon class="mb-1">lock</v-icon> {{talentData.r2_name}}
            </span>
            <span v-else>
              <v-icon class="mb-1">star</v-icon><v-icon class="mb-1">star</v-icon> {{talentData.r2_name}}
            </span>
          </div>
          <p class="pl-4" v-html="talentData.r2_desc" />
        </div>
      </v-card-title>
    </v-card>
    <v-card :color="isLocked(3) ? 'grey lighten-1' : 'blue lighten-5'">
      <v-card-title primary-title>
        <div>
          <div class="title">
            <span v-if="isLocked(3)">
              <v-icon class="mb-1">lock</v-icon> {{talentData.r3_name}}
            </span>
            <span v-else>
              <v-icon class="mb-1">star</v-icon><v-icon class="mb-1">star</v-icon><v-icon class="mb-1">star</v-icon> {{talentData.r3_name}}
            </span>
          </div>
          <p class="pl-4" v-html="talentData.r3_desc" />
        </div>
      </v-card-title>
    </v-card>

        <!-- <v-card-text>
          <p>{{talentData.description}}</p>
          <v-card>[*] {{talentData.r1_name}}</v-card>
            <v-layout>
              <v-flex>
                <p v-html="talentData.r1_desc" />
              </v-flex>
            </v-layout>
            <br>
            <v-card :class="{locked: isLocked(2)}">[**] {{talentData.r2_name}}</v-card>
            <v-layout>
              <v-flex>
                <p :class="{'text-muted': isLocked(2)}" v-html="talentData.r2_desc" />
              </v-flex>
            </v-layout>
            <br>
            <v-card :class="{locked: isLocked(2)}">[***] {{talentData.r3_name}}</v-card>
            <v-layout>
              <v-flex>
                <p :class="{'text-muted': isLocked(3)}" v-html="talentData.r3_desc" />
              </v-flex>
            </v-layout>   
        </v-card-text>
      </v-card> -->
  </v-expansion-panel-content>
</template>

<script>
  export default {
    name: 'talent-item',
    props: [
      'talent',
      'talentData'
    ],
    methods: {
      isLocked (target) {
        return !(this.talent.rank >= target)
      }
    }
  }
</script>

<style scoped>
  .locked {
    background-color: lightgray;
    cursor: not-allowed;
  }
</style>
