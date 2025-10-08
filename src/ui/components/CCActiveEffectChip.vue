<template>
  <cc-dialog :close-on-click="false" title="test active effect" icon="mdi-rhombus-outline">
    <template #activator="{ open }">
      <v-chip
        prepend-icon="mdi-rhombus-outline"
        color="primary"
        variant="elevated"
        flat
        style="
          corner-left-shape: bevel;
          border-radius: 6px;
          border-right: 2px solid #d93f4e;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        "
        @click="open">
        <v-tooltip location="top">
          <template #activator="{ props }">
            <div v-bind="props" class="mr-2 font-weight-bold">Test Active Effect</div>
          </template>
          <div>
            <div class="text-cc-overline">Test Active Effect</div>
            <div class="text-caption text-disabled"><i>From Origin System</i></div>
            <v-divider class="my-1" />
            <div class="text-text pa-1">
              If condition is met, deal 1d6 Kinetic Damage to adjacent enemies
            </div>
            <div class="text-cc-overline">1/round</div>
          </div>
        </v-tooltip>
      </v-chip>
    </template>
    <div>
      <div class="text-right text-caption text-disabled mb-1"><i>From Origin System - LCP</i></div>

      <cc-alert color="primary"><b>If: condition</b></cc-alert>
      <div class="text-text pa-1">Deal +1d6 Kinetic Damage to adjacent enemies</div>
      <v-card flat tile color="panel">
        <div class="pa-2">
          <v-row dense align="center">
            <v-col cols="auto">
              <v-btn icon size="x-small" variant="text" flat tile class="mt-2">
                <v-icon size="25" icon="mdi-dice-6" />
              </v-btn>
            </v-col>
            <v-col>
              <div class="text-cc-overline text-disabled">Kinetic Damage</div>
              <v-text-field
                value="4"
                type="number"
                density="compact"
                hide-details
                variant="outlined"
                flat
                tile />
            </v-col>
            <v-col>
              <div class="text-cc-overline text-disabled">Target</div>
              <v-select
                value="T1 Elite Bombard Mech"
                type="number"
                density="compact"
                hide-details
                variant="outlined"
                flat
                tile />
            </v-col>
          </v-row>
          <br />
          <cc-button size="x-small" block color="primary" prepend-icon="mdi-plus" flat tile>
            Add Target
          </cc-button>
        </div>
      </v-card>
      <div class="d-flex justify-end mt-2 mr-4">
        <cc-button size="small" stacked>Cancel</cc-button>
        <v-spacer />
        <cc-button size="small" stacked color="primary">
          <div class="px-6">
            Confirm
            <div class="text-disabled mt-1" style="letter-spacing: 1px">(1/round)</div>
          </div>
        </cc-button>
      </div>
    </div>
  </cc-dialog>
</template>
