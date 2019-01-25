<template>
  <b-row>
    <b-col>
      <b-card no-body>
        <b-card-header header-tag="header" role="tab">
          <b-btn block v-b-toggle="talent.id">{{talent.rank}} - {{talentData.name}}</b-btn>
        </b-card-header>
        <b-collapse :id="talent.id" accordion="talent-accordion" role="tabpanel">
          <b-card-body>
            <p>{{talentData.description}}</p>
            <b-card no-body>[*] {{talentData.r1_name}}</b-card>
              <b-row>
                <b-col>
                  <p v-html="talentData.r1_desc" />
                </b-col>
              </b-row>
              <br>
              <b-card no-body :class="{locked: isLocked(2)}">[**] {{talentData.r2_name}}</b-card>
              <b-row>
                <b-col>
                  <p :class="{'text-muted': isLocked(2)}" v-html="talentData.r2_desc" />
                </b-col>
              </b-row>
              <br>
              <b-card no-body :class="{locked: isLocked(2)}">[***] {{talentData.r3_name}}</b-card>
              <b-row>
                <b-col>
                  <p :class="{'text-muted': isLocked(3)}" v-html="talentData.r3_desc" />
                </b-col>
              </b-row>          
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-col>
  </b-row>
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
