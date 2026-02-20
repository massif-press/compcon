<template>
  <v-col cols="auto"
    class="ml-auto mr-2 text-center caption">
    <div class="text-overline text-primary my-n2">OVERCHARGE</div>
    <v-chip size="20"
      variant="outlined"
      color="red"
      class="ml-1">
      &nbsp;+1
      <v-icon size="small"
        icon="mdi-fire" />
    </v-chip>
    <v-chip size="20"
      variant="outlined"
      color="red"
      class="ml-1">
      &nbsp;+1d3
      <v-icon size="small"
        icon="mdi-fire" />
    </v-chip>
    <v-chip size="20"
      variant="outlined"
      color="red"
      class="ml-1">
      &nbsp;+1d6
      <v-icon size="small"
        icon="mdi-fire" />
    </v-chip>
    <v-chip size="20"
      variant="outlined"
      color="red"
      class="ml-1">
      &nbsp;+1d6+4
      <v-icon size="small"
        icon="mdi-fire" />
    </v-chip>
  </v-col>
</template>

<script>
export default {
  name: 'PrintOvercharge'
}
</script>