<template>
  <v-scale-transition leave-absolute mode="out-in">
    <div v-if="showWelcome" :class="mobile ? 'takeover' : 'sidePanel'">
      <v-row no-gutters justify="center" align="center" style="height: 100%; position: relative">
        <v-col cols="auto">
          <div style="min-width: 600px; max-width: 600px">
            <cc-toolbar
              title="CC.SYSADMIN// NOTIFY"
              color="primary"
              icon="cc:gms"
              class="border-b-sm">
              <template #toolbar-items>
                <v-tooltip max-width="300" location="top">
                  <template #activator="{ props }">
                    <cc-button
                      v-bind="props"
                      tile
                      variant="text"
                      icon="mdi-check-all"
                      @click="markAllAsRead" />
                  </template>
                  <span>Mark all messages as Read</span>
                </v-tooltip>
              </template>
            </cc-toolbar>
            <div style="width: 100%">
              <v-tabs
                v-model="tab"
                grow
                center-active
                show-arrows
                density="compact"
                bg-color="primary"
                slider-color="secondary"
                height="26">
                <v-tab v-for="m in messages">
                  <v-badge v-model="m.showDot" dot floating class="mt-1" color="warning">
                    {{ new Date(m.timestamp).toLocaleDateString() }}
                  </v-badge>
                </v-tab>
              </v-tabs>
            </div>
            <cc-panel height="70vh" color="panel" border style="margin-top: -2px">
              <v-window v-model="tab">
                <v-window-item v-for="m in messages" :key="m.timestamp">
                  <cc-heading small line>
                    {{
                      new Date(m.timestamp).toLocaleString(undefined, {
                        dateStyle: 'full',
                        timeStyle: 'long',
                      })
                    }}
                  </cc-heading>
                  <cc-heading type="h3">{{ m.title }}</cc-heading>
                  <p class="pa-2" v-html="m.body" />
                  <cc-button class="my-4" block color="primary" size="x-small" @click="ack(m)">
                    Acknowledge
                  </cc-button>
                </v-window-item>
              </v-window>
            </cc-panel>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-scale-transition>
</template>

<script lang="ts">
import { CompendiumStore, UserStore } from '@/stores';

export default {
  name: 'welcome-dialog',
  data: () => ({
    showWelcome: true,
    tab: 0,
    messages: [
      {
        timestamp: 1738796694000,
        title: 'Debug Message',
        body: 'Debug message contents',
        read: false,
        showDot: true,
      },
    ],
  }),
  computed: {
    profile() {
      return UserStore().User;
    },
    loaded() {
      return CompendiumStore().loaded;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
    showPanel: {
      get() {
        if (!this.profile) return false;
        return UserStore().User.View('WelcomePanel', true);
      },
      set(value) {
        UserStore().User.View('WelcomePanel', value);
      },
    },
  },
  watch: {},
  methods: {
    ack(message) {
      message.read = true;
      message.showDot = false;
      this.close();
    },
    close() {
      this.showWelcome = false;
    },
    markAllAsRead() {
      this.messages.forEach((message) => {
        message.read = true;
      });
    },
  },
};
</script>

<style scoped>
.sidePanel {
  position: absolute;
  top: 12vh;
  left: 50vw;
  right: 15vw;
  bottom: 8vh;
  z-index: 2;
}

.takeover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 99999;
}
</style>
