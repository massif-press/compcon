<template>
  <v-scale-transition leave-absolute mode="out-in">
    <div v-if="panel" :class="mobile ? 'takeover' : 'sidePanel'">
      <v-row no-gutters justify="center" align="center" style="height: 100%">
        <v-col cols="auto">
          <div :style="!mobile && 'min-width: 600px'" style="max-width: 600px">
            <cc-toolbar
              title="CC.SYSADMIN// NOTIFY"
              color="primary"
              icon="cc:gms"
              class="border-b-sm"
              @close="panel = false">
              <template #toolbar-items>
                <v-tooltip max-width="300" location="top">
                  <template #activator="{ props }">
                    <span v-bind="props">
                      <cc-button tile variant="text" icon="mdi-check-all" @click="markAllAsRead" />
                    </span>
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
                <v-tab v-for="m in systemMessages">
                  <v-badge v-if="isUnread(m)" dot floating class="mt-1" color="warning">
                    {{ new Date(m.created * 1000).toLocaleDateString() }}
                  </v-badge>
                  <span v-else>{{ new Date(m.created * 1000).toLocaleDateString() }}</span>
                </v-tab>
              </v-tabs>
            </div>
            <cc-panel height="70vh" color="panel" border style="margin-top: -2px">
              <v-window v-model="tab">
                <v-window-item v-for="m in systemMessages">
                  <div class="text-cc-overline">
                    {{
                      new Date(m.created * 1000).toLocaleString(undefined, {
                        dateStyle: 'full',
                        timeStyle: 'long',
                      })
                    }}
                  </div>
                  <v-divider class="my-2" />
                  <div class="heading h3 text-accent">{{ m.title }}</div>
                  <p class="pa-2" v-html="m.body" />
                  <cc-button class="ma-4" block color="accent" size="x-small" @click="ack(m)">
                    Mark as Read
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
import systemMessages from '@/assets/system_messages.json';

export default {
  name: 'welcome-dialog',
  data: () => ({
    panel: false,
    tab: 0,
  }),
  mounted() {
    this.panel = this.unreadMessages.length > 0;
    this.tab = this.systemMessages.findIndex((message) =>
      this.unreadMessages.find((m) => m.id === message.id)
    );
  },
  computed: {
    systemMessages() {
      return systemMessages;
    },
    unreadMessages() {
      const userReadMessages = UserStore().User.ReadMessages;
      return this.systemMessages.filter((message) => !userReadMessages.includes(message.id));
    },
    loaded() {
      return CompendiumStore().loaded;
    },
    mobile() {
      return this.$vuetify.display.mdAndDown;
    },
  },
  methods: {
    isUnread(message) {
      return !UserStore().User.ReadMessages.includes(message.id);
    },
    ack(message) {
      UserStore().User.SetMessageRead(message.id);
      if (this.unreadMessages.length)
        this.tab = this.systemMessages.findIndex((m) =>
          this.unreadMessages.find((um) => um.id === m.id)
        );
      else this.panel = false;
    },
    markAllAsRead() {
      UserStore().User.ReadMessages = this.systemMessages.map((m) => m.id);
      this.panel = false;
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
