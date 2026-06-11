<template>
  <v-card-text>
    <p>{{ $t("mainMenu.deleteAccount.intro") }}</p>

    <ul class="ml-6 mb-3">
      <li>{{ $t("mainMenu.deleteAccount.incCredentials") }}</li>
      <li>{{ $t("mainMenu.deleteAccount.incCloudData") }}</li>
      <li>{{ $t("mainMenu.deleteAccount.incImages") }}</li>
      <li>{{ $t("mainMenu.deleteAccount.incArchives") }}</li>
      <li>{{ $t("mainMenu.deleteAccount.incActiveMode") }}</li>
    </ul>
    {{ $t("mainMenu.deleteAccount.additionally") }}
    <ul class="ml-6 mb-3">
      <li>{{ $t("mainMenu.deleteAccount.addNoSync") }}</li>
      <li>{{ $t("mainMenu.deleteAccount.addShareExpire") }}</li>
      <li>{{ $t("mainMenu.deleteAccount.addSyncTerminated") }}</li>
      <li>{{ $t("mainMenu.deleteAccount.addRemovedTables") }}</li>
      <li>{{ $t("mainMenu.deleteAccount.addGmTables") }}</li>
      <li>
        {{ $t("mainMenu.deleteAccount.addSubFeed") }}
      </li>
    </ul>
    {{ $t("mainMenu.deleteAccount.thisWillNot") }}
    <ul class="ml-6 mb-3">
      <li>{{ $t("mainMenu.deleteAccount.notLocalData") }}</li>
      <li>{{ $t("mainMenu.deleteAccount.notPurchases") }}</li>
    </ul>

    <cc-alert color="error"
      icon="mdi-alert"
      prominent>
      <b>{{ $t("mainMenu.deleteAccount.irreversible") }}</b>
      <br />
      {{ $t("mainMenu.deleteAccount.ensureBackup") }}
    </cc-alert>

    <div class="text-caption text-center my-1">
      <i18n-t keypath="mainMenu.deleteAccount.enterTextToConfirm" tag="span" scope="global">
        <template #phrase>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <i><b>delete account</b></i>
        </template>
      </i18n-t>
    </div>
    <v-text-field v-model="confirm"
      placeholder="delete account"
      type="text"
      required
      hide-details />
    <cc-button type="submit"
      color="red"
      block
      size="x-large"
      class="mt-2"
      :loading="loading"
      :disabled="!confirmValid"
      @click="handleDeleteUser">
      {{ $t("mainMenu.deleteAccount.deleteAccountBtn") }}
    </cc-button>
    <v-fade-transition>
      <div v-if="loading"
        class="text-caption text-center my-1">
        <i>
          {{ $t("mainMenu.deleteAccount.deletionInProgress") }}
        </i>
      </div>
    </v-fade-transition>
  </v-card-text>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { UserStore } from '@/stores';
import logger from '@/user/logger';
import { deleteUser } from 'aws-amplify/auth';

defineOptions({ name: 'DeleteCloudAccount' })

const confirm = ref('')
const loading = ref(false)

const confirmValid = computed(() => {
      return confirm.value.toLowerCase() === 'delete account';
    })

async function handleDeleteUser() {
      loading.value = true;
      try {
        await UserStore().deleteAllCloudData();
        await deleteUser();
        location.reload();
      } catch (error) {
        logger.error(`Error deleting user: ${error}`, this, error);
      }
    }
</script>
