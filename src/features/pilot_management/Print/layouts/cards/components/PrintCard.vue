<template>
  <v-col cols="auto">
    <v-card
      variant="outlined"
      class="pa-2 no-print-break"
      width="2.5in"
      color="primary"
      style="position: relative; min-height: 3.5in; height: auto">
      <div class="text-black">
        <slot />
      </div>
    </v-card>
  </v-col>
</template>
