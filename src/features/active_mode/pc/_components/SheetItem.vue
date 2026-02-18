<template>
  <div style="position: relative"
    class="li-top-element">
    <div class="light"
      style="position: absolute; top: 0; left: -15px; bottom: 0; width: 10px" />
    <v-row no-gutters
      class="lighten-select"
      :class="mobile ? 'mb-2' : 'mb-4'"
      @click="$emit('launch')">
      <v-col cols="auto"
        style="height: 100%; border: rgb(var(--v-theme-primary)) 3px double">
        <v-card style="position: relative">
          <!-- <cc-avatar v-if="sheet.Avatar" :avatar="sheet.Avatar" :size="mobile ? 75 : 150" /> -->
          <cc-img v-if="pilot.Portrait"
            :src="pilot.Portrait"
            aspect-ratio="1"
            position="top center"
            :height="mobile ? '75px' : '150px'"
            :width="mobile ? '75px' : '150px'" />
          <div v-if="mech.Portrait"
            class="bg-panel"
            style="
              position: absolute;
              bottom: 0;
              right: 0;
              width: 75%;
              height: 75%;
              clip-path: polygon(100% 0, 0% 100%, 100% 100%);
            ">
            <div style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"
              :style="`background: linear-gradient(135deg,${mech.Frame.ManufacturerColor} 52%, rgb(var(--v-theme-panel)) 51%, rgb(var(--v-theme-panel))  100%);`" />

            <img style="
                position: absolute;
                top: 20%;
                left: 10%;
                max-width: 200px;
                max-height: 200px;
                width: auto;
                height: auto;
              "
              :src="mech.Portrait" />
          </div>
        </v-card>
      </v-col>
      <v-col style="position: relative">
        <v-toolbar density="compact"
          class="cToolbar"
          :height="mobile ? '40' : '46'">
          <v-row no-gutters
            align="center"
            class="px-2">
            <v-col cols="auto"
              class="heading text-white">
              {{ pilot.Callsign }}
            </v-col>
            <v-col cols="auto"
              class="mx-3"
              style="margin-top: -3px">
              <cc-chip size="x-small"
                variant="elevated"
                :title="sheet.TableName || 'Local'"
                :label="sheet.Campaign || 'No Campaign Information'"
                :color="sheet.TableName ? 'secondary' : 'panel'"
                :bg-color="sheet.Campaign ? 'exotic' : ''">
                <v-icon v-if="sheet.Campaign"
                  icon="cc:campaign"
                  class="mr-1" />
              </cc-chip>
            </v-col>
            <v-col cols="auto"
              class="mr-n2 ml-auto">
              <v-menu>
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    start
                    color="white"
                    @click.stop
                    icon="mdi-cog"
                    size="small"
                    class="fade-select" />
                </template>
                <div class="bg-panel pa-1">
                  <v-list-item @click="$emit('archive')"
                    prepend-icon="mdi-archive">
                    <v-list-item-title>Archive Sheet</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="$emit('export')"
                    prepend-icon="mdi-file-export">
                    <v-list-item-title>Export Sheet</v-list-item-title>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item @click="$emit('delete')"
                    prepend-icon="mdi-delete">
                    <v-list-item-title>Delete Sheet</v-list-item-title>
                  </v-list-item>
                </div>
              </v-menu>
            </v-col>
          </v-row>
        </v-toolbar>

        <div v-if="mobile"
          class="detail-row-mobile px-2 pt-1 text-cc-overline">
          <div v-if="pilot.CombatController.Mounted">
            <b class="text-stark">MOUNTED</b> &mdash; <i>{{ mech.Name }} ({{ mech.Frame.Source }} {{
              mech.Frame.Name
            }})</i>
          </div>
          <div v-else>
            <b class="text-stark">UNMOUNTED</b>
          </div>
          <div class="text-disabled mt-1">
            Encounter
            {{ sheet.Encounter }} //
            Round {{ pilot.CombatController.Round }}
          </div>
        </div>

        <div v-else
          class="px-3">
          <v-row class="detail-row">
            <v-col class="text-cc-overline pt-4">
              <div>
                <b>
                  {{ pilot.Callsign }}
                </b>
                ({{ pilot.Name }})
                <b v-if="pilot.CombatController.Mounted"
                  class="text-stark">
                  MOUNTED
                </b>
                <b v-else
                  class="text-stark">
                  UNMOUNTED
                </b>
              </div>

              <v-row dense
                justify="space-around"
                class="pt-1"
                align="center">
                <v-col cols="auto"
                  v-for="stat in pilot.StatController.GetStatCollection([
                    'hp',
                    'overshield',
                    'stress',
                    'heatcap',
                    'structure',
                    'repairCapacity',
                  ])">
                  <v-tooltip location="top"
                    open-delay="400">
                    <template #activator="{ props }">
                      <v-icon v-bind="props"
                        class="mx-1 mt-n1"
                        :icon="stat.icon" />
                      <b class="text-accent">{{ pilot.StatController.CurrentStats[stat.key] }}</b>
                    </template>
                    <div class="text-cc-overline text-center">
                      {{ stat.title }}
                    </div>
                    <div class="heading h3 text-accent text-center">
                      {{ pilot.StatController.CurrentStats[stat.key] }}
                      <span class="body-text text-text">
                        / {{ pilot.StatController.MaxStats[stat.key] }}
                      </span>
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col cols="auto"
                  v-for="stat in pilot.StatController.GetStatCollection([
                    'armor',
                    'evasion',
                    'edef',
                    'saveTarget',
                  ])">
                  <v-tooltip :text="stat.title"
                    location="top"
                    open-delay="400">
                    <template #activator="{ props }">
                      <v-icon v-bind="props"
                        class="mx-1 mt-n1"
                        :icon="stat.icon" />
                      <b class="text-secondary">
                        {{ pilot.StatController.CurrentStats[stat.key] }}
                      </b>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>


              <v-divider class="my-1" />
              <div><b>{{ mech.Name }}</b> ({{ mech.Frame.Source }} {{ mech.Frame.Name }}) </div>
              <v-row dense
                justify="space-around"
                align="center">
                <v-col cols="auto"
                  v-for="stat in pilot.StatController.GetStatCollection([
                    'hp',
                    'overshield',
                    'stress',
                    'heatcap',
                    'structure',
                    'repairCapacity',
                  ])">
                  <v-tooltip location="top"
                    open-delay="400">
                    <template #activator="{ props }">
                      <v-icon v-bind="props"
                        class="mx-1 mt-n1"
                        :icon="stat.icon" />
                      <b class="text-accent">{{ mech.StatController.CurrentStats[stat.key] }}</b>
                    </template>
                    <div class="text-cc-overline text-center">
                      {{ stat.title }}
                    </div>
                    <div class="heading h3 text-accent text-center">
                      {{ mech.StatController.CurrentStats[stat.key] }}
                      <span class="body-text text-text">
                        / {{ mech.StatController.MaxStats[stat.key] }}
                      </span>
                    </div>
                  </v-tooltip>
                </v-col>
                <v-col cols="auto"
                  v-for="stat in mech.StatController.GetStatCollection([
                    'armor',
                    'evasion',
                    'edef',
                    'saveTarget',
                  ])">
                  <v-tooltip :text="stat.title"
                    location="top"
                    open-delay="400">
                    <template #activator="{ props }">
                      <v-icon v-bind="props"
                        class="mx-1 mt-n1"
                        :icon="stat.icon" />
                      <b class="text-secondary">
                        {{ mech.StatController.CurrentStats[stat.key] }}
                      </b>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>


              <v-divider class="my-1" />
              started <b>{{ new Date(sheet.Created).toLocaleDateString() }}</b> &mdash; last turn
              <b>{{ sheet.Updated ? new
                Date(sheet.Updated).toLocaleDateString() : 'N/A' }}</b>
              <br />
              <div>
                Encounter
                {{ sheet.Encounter }} //
                Round {{ pilot.CombatController.Round }}
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  name: 'sheet-list-item',
  props: {
    sheet: {
      type: Object,
      required: true,
    },
  },
  emits: ['archive', 'delete', 'launch'],
  data: () => ({
    loading: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    pilot() {
      return this.sheet.Combatant.actor;
    },
    mech() {
      return this.sheet.Combatant.actor.ActiveMech;
    },
  },
}
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
  background: repeating-linear-gradient(45deg,
      rgb(var(--v-theme-error-darken-2)),
      rgb(var(--v-theme-error-darken-2)) 10px,
      rgb(var(--v-theme-error-darken-3)) 10px,
      rgb(var(--v-theme-error-darken-3)) 20px);
}

.light {
  transition: background-color 0.2s ease-in-out;
  background-color: rgb(var(--v-theme-primary));
}

.li-top-element:hover .light {
  background-color: rgb(var(--v-theme-success));
}

.success-pulse {
  animation: success-pulse 1.8s infinite;
}

@keyframes success-pulse {
  0% {
    box-shadow: 0 0 0 0px rgb(var(--v-theme-success));
    border-radius: 0px;
  }

  100% {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
    border-radius: 1px;
  }
}
</style>
