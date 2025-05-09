<template>
  <div style="position: relative" class="li-top-element">
    <div class="light" style="position: absolute; top: 0; left: -15px; bottom: 0; width: 10px" />
    <v-row no-gutters class="lighten-select" :class="mobile ? 'mb-2' : 'mb-4'">
      <v-col cols="auto" style="height: 100%; border: rgb(var(--v-theme-primary)) 3px double">
        <v-card style="position: relative">
          <!-- <cc-avatar v-if="sheet.Avatar" :avatar="sheet.Avatar" :size="mobile ? 75 : 150" /> -->
          <cc-img
            v-if="sheet.Portrait"
            :src="sheet.Portrait"
            aspect-ratio="1"
            position="top center"
            :height="mobile ? '75px' : '150px'"
            :width="mobile ? '75px' : '150px'" />
          <div
            v-if="sheet.MechPortrait"
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
              :style="`background: linear-gradient(135deg,${sheet.SourceColor} 52%, rgb(var(--v-theme-panel)) 51%, rgb(var(--v-theme-panel))  100%);`" />

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
              :src="sheet.MechPortrait" />
          </div>
        </v-card>
      </v-col>
      <v-col style="position: relative">
        <v-toolbar density="compact" class="cToolbar" :height="mobile ? '40' : '46'">
          <v-row no-gutters align="center" class="px-2">
            <v-col cols="auto" class="heading text-white">
              {{ sheet.Callsign }}
            </v-col>
            <v-col cols="auto" class="mx-3" style="margin-top: -3px">
              <cc-chip
                size="x-small"
                variant="elevated"
                :title="sheet.TableName || 'Local'"
                :label="sheet.Campaign || 'No Campaign Information'"
                :color="sheet.TableName ? 'secondary' : 'panel'"
                :bg-color="sheet.Campaign ? 'exotic' : ''">
                <v-icon v-if="sheet.Campaign" icon="cc:campaign" class="mr-1" />
              </cc-chip>
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

        <div v-if="mobile" class="detail-row-mobile pa-2">
          <b class="text-stark">{{ sheet.Name }}</b>
          <div class="text-cc-overline">
            <span class="text-disabled">License Level</span>
            {{ sheet.Level }}
          </div>
        </div>

        <div v-else class="px-3">
          <v-row class="detail-row">
            <v-col class="text-cc-overline pt-4">
              <div>
                {{ sheet.Name }}
                <cc-slashes />
                License Level {{ sheet.Level }}
              </div>
              <div>pilot status info</div>
              <v-divider class="my-1" />
              <div>{{ sheet.MechName }} ({{ sheet.Frame }}) {{ sheet.MechStatus }}</div>
              <v-divider class="my-1" />
              started datetime - last activity datetime
              <br />
              currently on:
              <br />
              <div v-html="sheet.Description" />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <div
      v-if="sheet.tableStatus"
      style="position: absolute; bottom: -10px; right: -10px; z-index: 1">
      <cc-chip v-if="loading">
        <span class="text-cc-overline pl-3 pr-2" style="letter-spacing: 3px">
          <v-progress-circular indeterminate size="20" width="2" color="accent" class="mr-4" />
          polling table status...
        </span>
      </cc-chip>
      <cc-chip
        v-else-if="sheet.tableStatus === 'Online'"
        variant="elevated"
        bg-color="success"
        icon="mdi-wifi"
        class="success-pulse">
        <span class="heading pl-3 pr-2" style="letter-spacing: 3px">TABLE ONLINE</span>
      </cc-chip>
      <cc-chip v-else icon="mdi-wifi-off">
        <span class="text-cc-overline pl-3 pr-2" style="letter-spacing: 3px">TABLE OFFLINE</span>
      </cc-chip>
    </div>
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
  data: () => ({
    loading: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
  mounted() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  },
  methods: {
    statusColor(status) {
      switch (status.toLowerCase()) {
        case 'active':
          return 'success';
        case 'mia':
        case 'kia':
        case 'err':
          return 'error';
        default:
          return 'text';
      }
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
