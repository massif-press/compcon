<template>
  <div style="position: relative" class="li-top-element">
    <div class="light" style="position: absolute; top: 0; left: -15px; bottom: 0; width: 10px" />
    <v-row no-gutters class="lighten-select" :class="mobile ? 'mb-2' : 'mb-4'">
      <v-col cols="auto" style="height: 100%; border: rgb(var(--v-theme-primary)) 3px double">
        <v-card style="position: relative">
          <cc-img
            v-if="encounter.Map"
            :src="encounter.Map"
            aspect-ratio="1"
            position="top center"
            :height="mobile ? '75px' : '150px'"
            :width="mobile ? '75px' : '150px'" />
        </v-card>
      </v-col>
      <v-col style="position: relative">
        <v-toolbar density="compact" class="cToolbar" :height="mobile ? '40' : '46'">
          <v-row no-gutters align="center" class="px-2">
            <v-col cols="auto" class="heading text-white">
              {{ encounter.Name }}
            </v-col>
            <v-col cols="auto" class="mr-n2 ml-auto">
              <v-menu>
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    start
                    color="white"
                    @click.stop
                    icon="mdi-cog"
                    size="small"
                    class="fade-select" />
                </template>
                <div class="bg-panel pa-1">menu options</div>
              </v-menu>
            </v-col>
          </v-row>
        </v-toolbar>

        <div class="px-3">
          <v-row class="detail-row">
            <v-col class="text-cc-overline pt-4">
              <div>
                {{ encounter.Name }}
                <cc-slashes />
                License Level {{ encounter.Level }}
              </div>
              <div>pilot status info</div>
              <v-divider class="my-1" />
              <div>{{ encounter.MechName }} ({{ encounter.Frame }}) {{ encounter.MechStatus }}</div>
              <v-divider class="my-1" />
              started datetime - last activity datetime
              <br />
              currently on:
              <br />
              <div v-html="encounter.Description" />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'active-encounter-list-item',
  props: {
    encounter: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.detail-row {
  background-color: rgb(var(--v-theme-light-panel));
  border-bottom: 1px rgb(var(--v-theme-primary)) solid;
  border-right: 1px rgb(var(--v-theme-primary)) solid;
  border-left: 1px rgb(var(--v-theme-primary)) solid;
  margin-left: -13px;
  min-height: 138px;
}

.detail-row-mobile {
  background-color: rgb(var(--v-theme-light-panel));
  border-bottom: 1px rgb(var(--v-theme-primary)) solid;
  border-right: 1px rgb(var(--v-theme-primary)) solid;
  border-left: 1px rgb(var(--v-theme-primary)) solid;
  margin-left: -1px;
  min-height: 57px;
}

.cToolbar {
  background-color: rgb(var(--v-theme-primary));
}

.cToolbar-missing {
  background: repeating-linear-gradient(
    45deg,
    rgb(var(--v-theme-error-darken-2)),
    rgb(var(--v-theme-error-darken-2)) 10px,
    rgb(var(--v-theme-error-darken-3)) 10px,
    rgb(var(--v-theme-error-darken-3)) 20px
  );
}

.light {
  transition: background-color 0.2s ease-in-out;
  background-color: rgb(var(--v-theme-primary));
}

.li-top-element:hover .light {
  background-color: rgb(var(--v-theme-success));
}
</style>
