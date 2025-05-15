<template>
  <v-container>
    <div class="heading h1">Tables</div>
    <div>
      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" color="panel" flat tile size="small" @click="setSort('Name')">
            <v-icon icon="mdi-check-network" size="large" color="accent" />
            <v-icon
              v-if="sort === 'Name'"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              size="large"
              color="accent" />
          </v-btn>
        </template>
        <span>Sort by Online Status</span>
      </v-tooltip>

      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" color="panel" flat tile size="small" @click="setSort('Name')">
            <v-icon icon="mdi-format-text-variant" size="large" color="accent" />
            <v-icon
              v-if="sort === 'Name'"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              size="large"
              color="accent" />
          </v-btn>
        </template>
        <span>Sort by Name</span>
      </v-tooltip>

      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" color="panel" flat tile size="small" @click="setSort('Updated')">
            <v-icon icon="mdi-crown-circle-outline" size="large" color="accent" />
            <v-icon
              v-if="sort === 'Source'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              size="large" />
          </v-btn>
        </template>
        <span>Sort by GM</span>
      </v-tooltip>

      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" color="panel" flat tile size="small" @click="setSort('Created')">
            <v-icon icon="mdi-clock" size="large" color="accent" />
            <v-icon
              v-if="sort === 'Created'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              size="large" />
          </v-btn>
        </template>
        <span>Sort by Last Online</span>
      </v-tooltip>

      <v-tooltip location="top" open-delay="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" color="panel" flat tile size="small" @click="setSort('Created')">
            <v-icon icon="mdi-calendar" size="large" color="accent" />
            <v-icon
              v-if="sort === 'Created'"
              color="accent"
              :icon="`mdi-chevron-${asc ? 'up' : 'down'}`"
              size="large" />
          </v-btn>
        </template>
        <span>Sort by Next Session</span>
      </v-tooltip>
    </div>
    <cc-panel v-for="table in tables" class="my-4" tile flat>
      <div>
        <span class="heading h2 text-accent">
          {{ table.name }}
        </span>
        <v-chip
          v-if="table.online"
          variant="elevated"
          color="success"
          size="x-small"
          class="mt-n2 ml-2 text-cc-overline success-pulse">
          Online
        </v-chip>
      </div>
      <v-divider class="mb-1" />

      <v-row class="mb-1">
        <v-col>
          <div>
            <span class="text-cc-overline mr-1">
              GM
              <cc-slashes />
            </span>
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  :icon="table.gm.online ? 'mdi-check-network' : 'mdi-network-off'"
                  :color="table.gm.online ? 'success' : 'grey'"
                  size="small" />
              </template>
              <b>{{ table.gm.name }}</b>
              <v-divider class="my-1" />
              <div class="text-cc-overline" :class="table.gm.online ? 'text-success' : 'text-grey'">
                {{ table.gm.online ? 'Online' : 'Offline' }}
              </div>
            </v-tooltip>
          </div>
          <p>
            <span class="text-cc-overline mr-1">
              Players
              <cc-slashes />
            </span>
            <v-tooltip v-for="p in table.players" :key="p.name" location="top">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  :icon="p.online ? 'mdi-check-network' : 'mdi-network-off'"
                  :color="p.online ? 'success' : 'grey'"
                  size="small" />
              </template>
              <b>{{ p.name }} ({{ p.callsign }})</b>
              <v-divider class="my-1" />
              <div class="text-cc-overline" :class="p.online ? 'text-success' : 'text-grey'">
                {{ p.online ? 'Online' : 'Offline' }}
              </div>
            </v-tooltip>
          </p>

          <div v-if="!table.online">
            <p>
              <span class="text-cc-overline">
                Last Online
                <cc-slashes />
              </span>
              {{
                new Date(table.lastOnline).toLocaleString(undefined, {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })
              }}
              CDT
            </p>
            <p>
              <span class="text-cc-overline">
                Next Session
                <cc-slashes />
              </span>
              {{
                new Date(table.nextSession).toLocaleString(undefined, {
                  dateStyle: 'full',
                })
              }}
              at 8 PM CDT
            </p>
          </div>
          <div>
            <div class="text-cc-overline mt-2">
              Currently Running
              <cc-slashes />
            </div>
            <v-card class="pa-2 text-center" variant="flat" tile color="panel">
              <v-row dense>
                <v-col v-if="table.campaign.image" cols="3">
                  <v-img :src="table.campaign.image" cover />
                </v-col>
                <v-col>
                  <div class="heading h3">
                    {{ table.campaign.name }}
                  </div>
                  <div class="d-flex justify-center align-center">
                    <v-divider class="justify-self-center ma-1" style="max-width: 400px" />
                  </div>
                  <span v-html="table.campaign.current" />
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-col>
        <v-col cols="auto" class="mt-2">
          <v-card style="position: relative" variant="outlined" flat tile color="primary">
            <cc-img
              v-if="table.Portrait"
              :src="table.Portrait"
              aspect-ratio="1"
              position="top center"
              :height="mobile ? '75px' : '150px'"
              :width="mobile ? '75px' : '150px'" />
            <div
              v-if="table.MechPortrait"
              class="bg-panel"
              style="
                position: absolute;
                bottom: 0;
                right: 0;
                width: 75%;
                height: 75%;
                clip-path: polygon(100% 0, 0% 100%, 100% 100%);
              ">
              <div
                style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"
                :style="`background: linear-gradient(135deg,${table.SourceColor} 52%, rgb(var(--v-theme-panel)) 51%, rgb(var(--v-theme-panel))  100%);`" />

              <img
                style="
                  position: absolute;
                  top: 20%;
                  left: 10%;
                  max-width: 200px;
                  max-height: 200px;
                  width: auto;
                  height: auto;
                "
                :src="table.MechPortrait" />
            </div>
          </v-card>
          <div class="text-cc-overline text-center mt-1">
            Callsign
            <br />
            Active Mech
          </div>
        </v-col>
      </v-row>
      <cc-button
        v-if="table.online"
        size="small"
        block
        color="success"
        prepend-icon="mdi-lan"
        class="mb-1"
        to="/active-mode/pilot-runner">
        Connect
      </cc-button>
      <cc-button
        v-else
        size="small"
        block
        color="panel"
        disabled
        prepend-icon="mdi-network-off"
        class="mb-1">
        GM OFFLINE
      </cc-button>
    </cc-panel>
    <v-row dense>
      <v-col offset="6">
        <cc-text-field
          label="Add Table"
          placeholder="Table Connect Code"
          color="primary"
          variant="outlined" />
      </v-col>
      <v-col cols="auto">
        <cc-button color="primary" class="mb-1">Search</cc-button>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-expansion-panels>
      <v-expansion-panel class="my-6" tile elevation="0">
        <v-expansion-panel-title class="text-cc-overline">Archived Tables</v-expansion-panel-title>
        <v-expansion-panel-text>
          completed/closed tables with history, after action reports, etc.
          <br />
          These should be printable/exportable and converted into narrative elements or similar.
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
export default {
  name: '',
  data: () => ({
    mobile: false,
    sort: 'Updated',
    asc: true,
    tables: [
      {
        id: 'table-1',
        name: "Beef's Table",
        campaign: 'No Room for a Wallflower',
        gm: {
          name: 'Beef',
          online: true,
        },
        players: [
          { name: 'Alice', callsign: 'Maverick', online: true },
          { name: 'Bob', callsign: 'Iceman', online: true },
          { name: 'Carla', callsign: 'Viper', online: true },
          { name: 'David', callsign: 'Ghost', online: false },
          { name: 'Edward', callsign: 'Phoenix', online: false },
        ],
        campaign: {
          image: 'https://img.itch.zone/aW1nLzUzOTk0MzIuanBn/315x250%23cb/YuE1nt.jpg',
          name: 'No Room for a Wallflower',
          current: 'Early Summer &mdash; Sepulcher',
        },
        status: 'active',
        online: true,
        Portrait: 'https://placebear.com/256/256',
        MechPortrait: 'https://d2c79xe1p61csc.cloudfront.net/frames/mf_zheng.png',
      },
      {
        id: 'table-2',
        name: 'Another Game',
        campaign: {
          name: 'Custom Campaign',
          current: 'Downtime',
        },
        gm: {
          name: 'Beef',
          online: false,
        },
        players: [
          { name: 'Alice', callsign: 'Maverick', online: false },
          { name: 'Bob', callsign: 'Iceman', online: false },
          { name: 'Carla', callsign: 'Viper', online: false },
        ],
        status: 'active',
        online: false,
        lastOnline: new Date().getTime() - 400 * 1000 * 1000,
        nextSession: new Date().getTime() + 400 * 1000 * 1000,
        Portrait: 'https://placebear.com/250/250',
        MechPortrait: 'https://d2c79xe1p61csc.cloudfront.net/frames/mf_goblin.png',
      },
    ],
  }),
};
</script>

<style scoped>
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
