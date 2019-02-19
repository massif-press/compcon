<template>
  <v-expansion-panel-content>
    <v-toolbar-title slot="header">
      <span>{{talentData.name}}</span>
      <span v-for="n in talent.rank" :key="`${talentData.id}_prank_${n}`"><v-icon>star</v-icon></span>
    </v-toolbar-title>
    <v-card >
      <v-card-title><blockquote class="blockquote m-0 pb-0 pt-0" v-html="talentData.description" /></v-card-title>
    </v-card>
    <v-card>
      <v-card-title primary-title class="pb-0 pt-0 mb-0">
        <div>
          <div class="title"><v-icon class="mb-1">star</v-icon> {{talentData.r1_name}}</div>
          <p class="pl-4" v-html="talentData.r1_desc" />
        </div>
      </v-card-title>
    </v-card>
    <v-card :color="isLocked(2) ? 'grey lighten-5' : ''">
      <v-card-title primary-title class="pb-0 pt-0 mb-0">
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
    <v-card :color="isLocked(3) ? 'grey lighten-5' : ''">
      <v-card-title primary-title class="pb-0 pt-0 mb-0">
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
