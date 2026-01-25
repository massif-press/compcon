<template>
  <v-col cols="auto"
    v-if="event.Save">
    <v-row no-gutters
      class="text-cc-overline text-disabled">
      <v-col> {{ event.Save }} Save</v-col>
      <v-col cols="auto"
        v-if="event.SaveHalf && !!event.Targets[0]">Half</v-col>
    </v-row>
    <div v-for="(s, idx) in event.Targets">
      <v-row v-if="!s"
        no-gutters
        align="center"
        justify="center"
        style="min-height: 43px;">
        <v-col cols="auto"
          class="mt-1">
          <i class="text-caption text-disabled">No Target Selected</i>
        </v-col>
      </v-row>

      <v-row v-else
        no-gutters>

        <v-col>
          <v-text-field v-model="s.SaveRolledValue"
            density="compact"
            variant="outlined"
            class="mb-1"
            type="number"
            width="85"
            hide-spin-buttons
            flat
            hide-details
            :error="!s.SaveRolledValue"
            tile
            @update:model-value="s.SaveRolledValue = Number($event)">
            <template #prepend>
              <save-roll-interface :roll-data="s" />
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="auto"
          align-self="center">
          <div class="text-center text-cc-overline px-2">VS</div>
        </v-col>
        <v-col>
          <v-text-field :value="s.SaveTarget"
            density="compact"
            variant="outlined"
            type="number"
            width="100"
            hide-spin-buttons
            flat
            :error="!s.SaveTarget"
            hide-details
            @update:model-value="s.SaveRolledValue = Number($event)">
            <template #append>
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-btn icon
                    size="x-small"
                    variant="text"
                    flat
                    tile
                    :color="s.SaveResult === 'success' ? 'success' : 'error'
                      "
                    class="ml-n2"
                    v-bind="props"
                    @click="overrideSave(s)">
                    <v-icon size="25"
                      :icon="!s.SaveResult
                        ? 'mdi-circle-outline'
                        : s.SaveResult === 'success'
                          ? 'mdi-check-circle'
                          : 'mdi-cancel'
                        " />
                  </v-btn>
                </template>

                <div class="text-center">
                  {{
                    !s.SaveResult
                      ? 'No Save Rolled'
                      : s.SaveResult === 'success'
                        ? 'Successful Save'
                        : 'Failed Save'
                  }}

                  <div>
                    <i class="text-caption text-disabled">Click to override</i>
                  </div>
                </div>
              </v-tooltip>
            </template>
          </v-text-field>
        </v-col>
        <v-col v-if="event.SaveHalf && !!s"
          cols="auto"
          class="ml-2 px-2 pt-2"
          style="min-height: 44px;">
          <cc-checkbox v-model="s.SavedHalf"
            color="error"
            size=small
            bg-color="background" />
        </v-col>
      </v-row>
    </div>
  </v-col>

</template>

<script>
import SaveRollInterface from './SaveRollInterface.vue';

export default {
  name: 'BaseSaveRoller',
  components: {
    SaveRollInterface
  },
  props: {
    event: { type: Object, required: true },
  },
  methods: {
    overrideSave(s) {
      if (!s.SaveResult) return;
      if (s.SaveResult === 'success') {
        s.SaveRolledValue = 0;
      } else {
        s.SaveRolledValue = s.SaveTarget
      }
    },

  },
};
</script>
