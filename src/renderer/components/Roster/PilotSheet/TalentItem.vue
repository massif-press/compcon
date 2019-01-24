<template>
  <b-row>
    <b-col>
      <b-card no-body>
        <b-card-header header-tag="header" role="tab">
          <b-btn block v-b-toggle="talent.id">{{talent.rank}} - {{talentData.name}}</b-btn>
        </b-card-header>
        <b-collapse :id="talent.id" accordion="talent-accordion" role="tabpanel">
          <b-card-body>
            <p class="card-text">
              {{ talent }}
              <br>
              {{ talentData }}
            </p>
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
    ]
  }
</script>