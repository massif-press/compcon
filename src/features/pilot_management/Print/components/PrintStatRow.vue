<template>
  <v-row justify="space-around"
    align="center"
    class="mt-n4 mb-1">
    <v-col cols="auto"
      class="text-center">
      <div class="font-weight-bold overline text-primary">HULL</div>
      <blank-line v-if="blank"
        :width="120"
        :height="35"
        class="mt-n1" />
      <div v-else
        class="heading h2"
        style="line-height: 14px"
        v-text="mech.Hull" />
    </v-col>
    <v-col cols="auto"
      class="text-center">
      <div class="font-weight-bold overline text-primary">AGILITY</div>
      <blank-line v-if="blank"
        :width="120"
        :height="35"
        class="mt-n1" />
      <div v-else
        class="heading h2"
        style="line-height: 14px"
        v-text="mech.Agi" />
    </v-col>
    <v-col cols="auto"
      class="text-center">
      <div class="font-weight-bold overline text-primary">SYSTEMS</div>
      <blank-line v-if="blank"
        :width="120"
        :height="35"
        class="mt-n1" />
      <div v-else
        class="heading h2"
        style="line-height: 14px"
        v-text="mech.Sys" />
    </v-col>
    <v-col cols="auto"
      class="text-center">
      <div class="font-weight-bold overline text-primary">ENGINEERING</div>
      <blank-line v-if="blank"
        :width="120"
        :height="35"
        class="mt-n1" />
      <div v-else
        class="heading h2"
        style="line-height: 14px"
        v-text="mech.Eng" />
    </v-col>
    <v-col cols="auto"
      class="text-center">
      <div v-if="blank">
        <div class="font-weight-bold overline text-primary">SIZE</div>
        <blank-line v-if="blank"
          :width="120"
          :height="35"
          class="mt-n1" />
      </div>
      <v-icon v-else
        color="primary"
        size="40">{{ mech.SizeIcon }}</v-icon>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PrintStatRow',
  props: {
    mech: {
      type: Object,
      required: true
    },
    blank: {
      type: Boolean,
      default: false
    }
  }
}
</script>