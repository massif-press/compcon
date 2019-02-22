<template>
  <div>
    <v-container grid-list-xl text-xs-center class="mt-0 pt-0 mb-0 pb-0">
    <v-layout row justify-space-between>
      <v-flex>
        <b>Advancements for License Level {{lvl}}:</b>
      </v-flex>
    </v-layout>
    <v-layout row justify-space-between>
      <v-flex xs3>
        <v-card color="grey lighten-3" elevation=10>
          <v-card-text>
            <span class="display-2">+2</span> &emsp; <b>Pilot Skill Points</b>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs3>
        <v-card color="grey lighten-3" elevation=10 >
          <v-card-text>
            <span class="display-2">+1</span> &emsp; <b>Mech Skill Point</b>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs3>
        <v-card color="grey lighten-3" elevation=10 >
          <v-card-text>
            <span class="display-2">+1</span> &emsp; <b>Talent Point</b>
          </v-card-text>
        </v-card>
      </v-flex>

    <v-flex xs3>
        <v-card color="grey lighten-3" elevation=10 >
          <v-card-text>
            <span class="display-2">+1</span> &emsp; <b>License Point</b>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row justify-center>
      <v-flex>
        <v-card color="grey lighten-3" elevation=10 >
          <v-card-text>
            <b>Grit:</b>
            <br>
              <span class="display-2 grey--text pr-2">
                {{ Math.floor((lvl - 1)/2)}}
              </span>
              <span>
                <v-icon size="40px" class="pl-4">arrow_forwards</v-icon>
              </span>
              <span class="display-2">
                {{ Math.floor((lvl)/2)}}
              </span>
              </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row justify-space-between v-if="lvl % 3 === 0">
      <v-flex xs6>
        <v-card color="grey lighten-3" elevation=10 >
          <v-card-text>
            <span class="display-2">+1</span> &emsp; <b>Core Bonus</b>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card color="grey lighten-3" elevation=10 >
          <v-card-text>
            <span class="display-2">+1</span> &emsp; <b>Skill Specialization</b>
          </v-card-text>
        </v-card>
      </v-flex> 
    </v-layout>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'level-update-block',
    props: ['lvl']
  }
</script>