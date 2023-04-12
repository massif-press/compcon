<template>
  <v-container fluid>
    <v-row density="compact" align="start">
      <single cols="5" label="CALLSIGN" height="60" />
      <v-divider vertical class="mx-2" />
      <single cols="1" label="HULL" height="60" />
      <single cols="1" label="AGI" height="60" />
      <single cols="1" label="SYS" height="60" />
      <single cols="1" label="ENG" height="60" />
      <v-divider vertical class="mx-2" />
      <single cols="auto" label="LEVEL" height="60" />
      <single cols="1" label="GRIT" height="60" />
    </v-row>
    <v-row density="compact" align="start">
      <single cols="3" label="NAME" height="20" />
      <single cols="3" label="BACKGROUND" height="20" />
      <single cols="2" label="STATUS" height="20" />
      <v-spacer />
      <single cols="3" label="PLAYER" height="20" />
    </v-row>
    <v-row density="compact" justify="center">
      <v-col cols="10">
        <v-row density="compact" justify="space-between">
          <v-col cols="auto">
            <div class="text-overline mb-n1">HP</div>
            <v-row density="compact" no-gutters align="center">
              <v-col cols="auto">
                <v-icon size="60" color="grey lighten-3" class="mr-n1"
                  >mdi-hexagon-outline</v-icon
                >
              </v-col>
              <v-col cols="auto" class="mt-6 mr-n2">
                <span
                  class="text-subtle text--lighten-1 display-2"
                  style="line-height: 0"
                  >/</span
                >
              </v-col>
              <v-col cols="auto" class="mb-n2">
                <v-icon size="50" color="grey lighten-3" class="mr-n1"
                  >mdi-hexagon-outline</v-icon
                >
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto">
            <div class="text-overline mb-n1">ARMOR</div>
            <v-icon size="60" color="grey lighten-3">mdi-shield-outline</v-icon>
          </v-col>
          <v-col cols="auto">
            <div class="text-overline mb-n1">EDEF</div>
            <v-icon size="60" color="grey lighten-3">cc:marker</v-icon>
          </v-col>
          <v-col cols="auto">
            <div class="text-overline mb-n1">EVASION</div>
            <v-icon size="60" color="grey lighten-3">cc:evasion</v-icon>
          </v-col>
          <v-col cols="auto">
            <div class="text-overline mb-n1">SPEED</div>
            <v-icon size="60" color="grey lighten-3"
              >mdi-arrow-right-bold-hexagon-outline</v-icon
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <v-row align="start">
      <v-col>
        <span class="overline">LICENSES ACQUIRED</span>
        <v-row v-for="n in 6" density="compact" no-gutters>
          <single cols="11" label="LICENSE" height="25" />
          <single cols="1" label="RANK" height="25" />
        </v-row>
      </v-col>
      <v-col>
        <span class="overline">SKILL TRIGGERS</span>
        <v-row v-for="n in 6" no-gutters>
          <single cols="10" label="SKILL" height="25" />
          <single cols="2" label="BONUS" height="25" />
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <span class="overline">TALENTS</span>
    <v-row v-for="n in 2" density="compact" justify="space-between" no-gutters>
      <v-col v-for="x in 2">
        <v-row density="compact">
          <single cols="7" label="TALENT" height="20" />
          <single cols="1" label="RANK" height="20" />
          <single cols="12" label="DESCRIPTION" height="150" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="my-2" />
    <div style="page-break-before: always" />
    <span class="overline">PILOT EQUIPMENT</span>
    <v-row density="compact" justify="space-between" class="mt-n2">
      <v-col>
        <v-row density="compact">
          <single cols="12" label="ARMOR" height="20" class="mb-n1" />
          <single cols="3" label="HP+" height="20" />
          <single cols="3" label="EDEF" height="20" />
          <single cols="3" label="EVADE" height="20" />
          <single cols="3" label="SPD" height="20" />
          <single cols="12" label="EFFECTS" height="100" class="mt-n2" />
        </v-row>
      </v-col>
      <v-col v-for="n in 2">
        <v-row density="compact">
          <single cols="12" label="WEAPON" height="20" class="mb-n1" />
          <single cols="4" label="RANGE" height="20" />
          <single cols="8" label="DAMAGE//TYPE" height="20" />
          <single cols="12" label="EFFECTS" height="100" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <v-row density="compact" justify="space-between">
      <v-col v-for="n in 3">
        <v-row density="compact">
          <single cols="9" label="GEAR" height="20" class="mb-n1" />
          <single cols="2" label="USES" height="20" />
          <single cols="12" label="EFFECTS" height="100" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <br />
    <v-divider class="my-2" />
    <span class="overline">RESERVES</span>
    <v-row density="compact" justify="space-between">
      <v-col v-for="n in 4">
        <v-row density="compact">
          <single cols="10" label="RESOURCE" height="20" class="mb-n1" />
          <single cols="1" label="USED" height="20" />
          <single cols="12" label="DESCRIPTION" height="175" class="mt-n2" />
        </v-row>
      </v-col>
    </v-row>
    <div style="page-break-before: always" />
    <v-row density="compact">
      <single cols="12" label="NOTES" height="225" class="mt-n2" />
      <single cols="12" label="RESOURCES" height="225" />
      <single cols="12" label="CONTACTS" height="225" />
      <single cols="12" label="MISSION LOG" height="225" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Single from './blanks/Single.vue';

export default {
  name: 'pilot-blank-view',
  components: { Single },
};
</script>

<style scoped>
.no-height {
  line-height: 0;
}

.icon-overlap {
  position: absolute;
  top: -5px;
  left: 1px;
  width: 100%;
  width: -webkit-fill-available;
  width: -moz-available;
  text-align: center;
}

.p-stat {
  font-size: 34px;
}

fieldset {
  padding: 0 4px;
  height: 100%;
  border-radius: 3px;
  border-color: rgb(var(--v-theme-grey-lighten2));
}
</style>
