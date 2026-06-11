<template>
  <v-scale-transition leave-absolute
    mode="out-in">
    <div v-if="panel"
      :class="mobile ? 'takeover' : 'sidePanel'">
      <v-row no-gutters
        justify="center"
        align="center"
        style="height: 100%">
        <v-col cols="auto">
          <div :style="!mobile && 'min-width: 600px'"
            style="max-width: 600px">
            <cc-toolbar title="CC.SYSADMIN// NOTIFY"
              color="primary"
              icon="cc:gms"
              class="border-b-sm"
              @close="panel = false">
              <template #toolbar-items>
                <v-tooltip max-width="300"
                  location="top">
                  <template #activator="{ props }">
                    <span v-bind="props">
                      <cc-button tile
                        variant="text"
                        icon="mdi-check-all"
                        @click="markAllAsRead" />
                    </span>
                  </template>
                  <span>{{ $t('mainMenu.menu.markAllRead') }}</span>
                </v-tooltip>
              </template>
            </cc-toolbar>
            <div style="width: 100%">
              <v-tabs v-model="tab"
                grow
                center-active
                show-arrows
                bg-color="primary"
                slider-color="secondary"
                height="26">
                <v-tab v-for="(m, mIdx) in systemMessages"
                  :key="`tab-${mIdx}`"
                  :class="mIdx === tab ? 'bg-accent' : ''">
                  <v-badge v-if="isUnread(m)"
                    dot
                    floating
                    class="my-2"
                    color="warning">
                    {{ new Date(m.created * 1000).toLocaleDateString() }}
                  </v-badge>
                  <span v-else>{{ new Date(m.created * 1000).toLocaleDateString() }}</span>
                </v-tab>
              </v-tabs>
            </div>
            <cc-panel height="70vh"
              color="panel"
              border
              style="margin-top: -2px">
              <v-window v-model="tab">
                <v-window-item v-for="(m, mIdx) in systemMessages"
                  :key="`window-${mIdx}`">
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
                  <p v-html-safe="m.body"
                    class="pa-2" />
                  <cc-button class="ma-4"
                    block
                    color="accent"
                    size="x-small"
                    @click="ack(m)">
                    {{ $t('mainMenu.menu.markAsRead') }}
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

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { CompendiumStore, UserStore } from '@/stores';
import systemMessages from '@/assets/system_messages.json';

const _display = useDisplay()

defineOptions({ name: 'WelcomeDialog' })

const panel = ref(false)
const tab = ref(0)

const unreadMessages = computed(() => {
  const userReadMessages = UserStore().User.ReadMessages
  return systemMessages.filter((message: any) => !userReadMessages.includes(message.id))
})

const loaded = computed(() => CompendiumStore().loaded)
const mobile = computed(() => _display.mdAndDown.value)

function isUnread(message: any) {
  return !UserStore().User.ReadMessages.includes(message.id)
}

function ack(message: any) {
  UserStore().User.SetMessageRead(message.id)
  if (unreadMessages.value.length)
    tab.value = systemMessages.findIndex((m: any) =>
      unreadMessages.value.find((um: any) => um.id === m.id)
    )
  else panel.value = false
}

function markAllAsRead() {
  UserStore().User.ReadMessages = systemMessages.map((m: any) => m.id)
  panel.value = false
}

onMounted(() => {
  panel.value = unreadMessages.value.length > 0
  tab.value = systemMessages.findIndex((message: any) =>
    unreadMessages.value.find((m: any) => m.id === message.id)
  )
})
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
