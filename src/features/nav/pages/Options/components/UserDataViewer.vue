<template>
  <v-card-text class="pa-2">
    <i class="text-cc-subtle">
      {{ $t('nav.userDataViewer.description') }}
      <br />
      {{ $t('nav.userDataViewer.achievementNote') }}
    </i>

    <v-table class="text-left mt-2"
      density="compact">
      <thead>
        <tr>
          <th>{{ $t('nav.userDataViewer.item') }}</th>
          <th>{{ $t('nav.userDataViewer.value') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in userDataKeys" :key="key">
          <td v-text="key.replace('_', '')" />
          <td v-if="key === '_options'">
            <v-row dense>
              <v-col cols="4"
                v-for="viewKey in Object.keys(user[key].views)"
              :key="viewKey">
                {{ viewKey }}:
                <b class="text-accent">{{ user[key].views[viewKey] }}</b>
              </v-col>
            </v-row>
          </td>
          <td v-else-if="Array.isArray(user[key])"
            v-text="`${user[key].length} items`" />
          <td v-else
            v-text="user[key]" />
        </tr>
      </tbody>
    </v-table>

    <div class="text-right">
      <cc-button size="small"
        variant="tonal"
        color="error"
        @click="resetUserData()">
        {{ $t('nav.userDataViewer.resetUserData') }}
      </cc-button>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay, useTheme } from 'vuetify'
import { UserStore } from '@/stores'

const { smAndDown: mobile } = useDisplay()
const theme = useTheme()

const user = computed(() => UserStore().User)

const userDataKeys = computed(() => {
  const skipKeys = ['LcpSubscriptionData', '_patreonData', '_itchData']
  if (mobile.value) skipKeys.push('_options')
  return Object.keys(UserStore().User).filter(key => !skipKeys.includes(key))
})

function resetUserData() {
  user.value.Reset()
  theme.global.name.value = user.value.Theme
}
</script>
