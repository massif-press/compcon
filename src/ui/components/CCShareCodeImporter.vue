<template>
  <cc-modal ref="modal" shrink title="add from share code" icon="mdi-code-block-brackets">
    <template #activator="{ open }">
      <cc-button
        color="primary"
        size="small"
        :block="blockBtn"
        :icon="mobile ? 'mdi-code-block-brackets' : undefined"
        prepend-icon="mdi-code-block-brackets"
        @click="open">
        {{ title }}
      </cc-button>
    </template>

    <div class="text-center">
      <cc-heading small line>Item Share Code</cc-heading>
      <div class="code-input" :class="mobile && 'mobile'">
        <span v-for="(digit, index) in code">
          <input
            :key="index"
            v-model="code[index]"
            maxlength="1"
            ref="codeInputs"
            @input="onInput(index)"
            @paste="onPaste($event, index)"
            @keydown.backspace="onBackspace(index)" />
          <span v-if="codeLength === 10 && index === 4" class="heading h1 px-4">
            &ndash;
            <br v-if="mobile" />
          </span>
          <span
            v-else-if="codeLength === 12 && (index === 3 || index === 7)"
            class="heading h1 px-4">
            &ndash;
            <br v-if="mobile" />
          </span>
          <span v-else-if="codeLength === 8 && index === 3" class="heading h1 px-4">
            &ndash;
            <br v-if="mobile" />
          </span>
        </span>
        <span class="heading h1 px-5 text-transparent">&ndash;</span>
      </div>
      <v-row no-gutters justify="center" class="my-4">
        <v-col cols="auto">
          <cc-button color="primary" :disabled="hasCode" :loading="loading" @click="getFromCode()">
            Find Item
          </cc-button>
        </v-col>
        <v-col cols="auto">
          <v-btn size="31.5" icon tile flat color="panel" @click="reset">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-card-text>
      <v-scroll-y-reverse-transition>
        <div v-if="badCode">
          <v-divider class="my-4" />
          <div class="text-center">
            <cc-alert
              type="error"
              prominent
              density="compact"
              icon="mdi-information-outline"
              title="error">
              No item found with code {{ formatCode(badCode) }}.
            </cc-alert>
          </div>
        </div>
      </v-scroll-y-reverse-transition>
      <v-scroll-y-reverse-transition>
        <div v-if="queryResult">
          <v-divider class="my-4" />
          <span class="flavor-text">// {{ importType.toUpperCase() }} DATA FOUND</span>
          <slot name="result" />
          <cc-alert
            v-if="isUserOwned || remoteItemExists"
            color="error"
            variant="tonal"
            prominent
            density="compact"
            class="my-2"
            icon="mdi-information-outline"
            title="error">
            <span v-if="isUserOwned">
              You are the author of this item. You cannot add your own items as remote resources.
            </span>
            <span v-else>This item has already been added as a remote resource.</span>
          </cc-alert>
          <cc-alert
            v-if="wrongType"
            color="error"
            variant="tonal"
            prominent
            density="compact"
            class="my-2"
            icon="mdi-information-outline"
            title="warning">
            <span>
              This item is a {{ qrImportType }}. It can still be imported, but will appear in the
              {{ qrImportType }} list, not the {{ importType }} list.
            </span>
          </cc-alert>
          <div class="text-right">
            <slot name="actions" />
          </div>
        </div>
      </v-scroll-y-reverse-transition>
    </v-card-text>
  </cc-modal>
</template>

<script lang="ts">
import { downloadFromS3, GetFromCode } from '@/io/apis/account';
import { UserStore } from '@/stores';
import logger from '@/user/logger';

export default {
  name: 'share-code-importer',
  props: {
    importType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: 'Add from Share Code',
    },
    blockBtn: {
      type: Boolean,
    },
  },
  data: () => ({
    codeLength: 12,
    codeSearch: '',
    code: [] as string[],
    queryResult: null as any,
    badCode: '',
    loading: false,
    dlLoading: false,
  }),
  created() {
    switch (this.importType.toLowerCase()) {
      case 'item':
      case 'pilot':
      case 'npc':
      case 'narrativeelement':
      case 'narrative':
      case 'collectionitem':
      case 'encounter':
        this.codeLength = 12;
        break;
      case 'campaign':
        this.codeLength = 8;
        break;
      case 'collection':
        this.codeLength = 10;
        break;
    }
    this.code = Array(this.codeLength).fill('');
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    qrImportType() {
      return this.queryResult && this.queryResult.sortkey.split('_')[1].toLowerCase();
    },
    hasCode() {
      return this.code.some((char) => char === '');
    },
    isUserOwned() {
      return this.queryResult && this.queryResult.user_id === UserStore().Cognito.userId;
    },
    canDownload() {
      return this.queryResult && this.queryResult.uri && !this.isUserOwned;
    },
    remoteItemExists() {
      return (
        this.queryResult &&
        UserStore().UserMetadata.RemoteItems &&
        UserStore().UserMetadata.RemoteItems.some((ri) => ri === this.queryResult.code)
      );
    },
    wrongType() {
      const skipTypes = ['item', 'campaign', 'collection'];
      if (skipTypes.includes(this.importType)) return false;
      const npcTypes = ['npc', 'unit', 'eidolon', 'doodad'];
      if (this.importType === 'npc' && npcTypes.includes(this.qrImportType)) return false;
      const narrativeTypes = ['narrative', 'character', 'location', 'faction'];
      if (this.importType === 'narrative' && narrativeTypes.includes(this.qrImportType))
        return false;
      return this.queryResult && this.qrImportType !== this.importType;
    },
  },
  methods: {
    onInput(index: number) {
      if (this.code[index].length === 1 && index < this.codeLength - 1) {
        (this.$refs.codeInputs as HTMLElement[])[index + 1].focus();
      }
    },
    onPaste(event: ClipboardEvent, index: number) {
      let pastedData = event.clipboardData?.getData('Text') || '';
      pastedData = pastedData.replace(/-/g, '');
      const pasteArray = pastedData.slice(0, this.codeLength).split('');
      pasteArray.forEach((char, i) => {
        if (index + i < 12) {
          this.code[index + i] = char;
        }
      });
      this.$nextTick(() => {
        const nextIndex = Math.min(index + pasteArray.length, this.codeLength - 1);
        (this.$refs.codeInputs as HTMLElement[])[nextIndex].focus();
      });
    },
    onBackspace(index: number) {
      if (this.code[index] === '' && index > 0) {
        this.code[index - 1] = '';
        (this.$refs.codeInputs as HTMLElement[])[index - 1].focus();
      }
    },
    async getFromCode() {
      this.loading = true;
      try {
        this.queryResult = await GetFromCode(this.code.join(''));
        this.$emit('set-query-result', this.queryResult);
        if (this.importType === 'campaign') {
          const campaign = await downloadFromS3(this.queryResult.uri);
          this.$emit('set-data', campaign);
        }
      } catch (err) {
        this.badCode = this.code.join('');
        this.queryResult = null;
        logger.error(`Error getting code: ${err}`, this, err);
      } finally {
        this.loading = false;
      }
    },
    reset() {
      this.code = Array(this.codeLength).fill('');
      this.queryResult = null;
      this.badCode = '';
    },
    formatCode(code: string) {
      if (code.length === 12)
        return code.slice(0, 4) + '-' + code.slice(4, 8) + '-' + code.slice(8, 12);
      if (code.length === 10) return code.slice(0, 5) + '-' + code.slice(5, 10);
      if (code.length === 8) return code.slice(0, 4) + '-' + code.slice(4, 8);
    },
  },
};
</script>

<style scoped>
.code-input input {
  width: 4rem;
  height: 4rem;
  font-size: 3rem;
  font-family: 'Helvetica Bold', sans-serif;
  text-align: center;
  margin: 0.2rem;
  border: 2px solid rgb(var(--v-theme-primary));
}

.code-input.mobile input {
  width: 3rem;
  height: 3rem;
  font-size: 2.5rem;
  font-family: 'Helvetica Bold', sans-serif;
  text-align: center;
  margin: 0.15rem;
  border: 2px solid rgb(var(--v-theme-primary));
}
</style>
