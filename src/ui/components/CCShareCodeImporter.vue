<template>
  <cc-modal ref="modal"
    shrink
    title="add from share code"
    icon="mdi-code-block-brackets">
    <template #activator="{ open }">
      <cc-button :color="color"
        :size="size"
        :block="blockBtn"
        :icon="mobile && !fullWidth ? 'mdi-code-block-brackets' : undefined"
        prepend-icon="mdi-code-block-brackets"
        @click="open">
        {{ title }}
        <template v-if="subtitle"
          #subtitle>
          <span class="text-cc-overline">{{ subtitle }}</span>
        </template>
      </cc-button>

    </template>

    <div class="text-center">
      <cc-heading small
        line>
        Item Share Code
      </cc-heading>
      <div class="code-input"
        :class="mobile && 'mobile'">
        <span v-for="(digit, index) in code"
          :key="`code-${index}`">
          <input :key="index"
            ref="codeInputs"
            v-model="code[index]"
            maxlength="1"
            @input="onInput($event, index)"
            @paste="onPaste($event, index)"
            @keydown.backspace="onBackspace(index)" />
          <span v-if="codeLength === 10 && index === 4"
            class="heading h1 px-4">
            &ndash;
            <br v-if="mobile" />
          </span>
          <span v-else-if="codeLength === 12 && (index === 3 || index === 7)"
            class="heading h1 px-4">
            &ndash;
            <br v-if="mobile" />
          </span>
          <span v-else-if="codeLength === 8 && index === 3"
            class="heading h1 px-4">
            &ndash;
            <br v-if="mobile" />
          </span>
        </span>
        <span class="heading h1 px-5 text-transparent">&ndash;</span>
      </div>
      <v-row no-gutters
        justify="center"
        class="my-4">
        <v-col cols="auto">
          <cc-button color="primary"
            :disabled="hasCode"
            :loading="loading"
            @click="getFromCode()">
            Find Item
          </cc-button>
        </v-col>
        <v-col cols="auto">
          <v-btn size="31.5"
            icon
            tile
            flat
            color="panel"
            @click="reset">
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
            <cc-alert type="error"
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
          <cc-alert v-if="isUserOwned || remoteItemExists"
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
          <cc-alert v-if="wrongType"
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { downloadFromS3, GetFromCode } from '@/io/apis/account';
import { UserStore } from '@/stores';
import logger from '@/user/logger';

const { smAndDown: mobile } = useDisplay();

const props = withDefaults(defineProps<{
  importType: string;
  title?: string;
  blockBtn?: boolean;
  color?: string;
  fullWidth?: boolean;
  subtitle?: string;
  size?: string;
}>(), {
  title: 'Add from Share Code',
  color: 'primary',
  fullWidth: false,
  subtitle: '',
  size: 'small',
});

const emit = defineEmits<{
  'set-query-result': [result: unknown];
  'set-data': [data: unknown];
  'set-share-code': [code: string];
}>();

const codeLength = ref(12);
const code = ref<string[]>([]);
const queryResult = ref<any>(null);
const badCode = ref('');
const loading = ref(false);
const codeInputs = ref<HTMLElement[]>([]);

const qrImportType = computed(() => {
  if (!queryResult.value?.sortkey) return null;
  const qr = queryResult.value.sortkey.split('_')[1].toLowerCase();
  return qr === 'pilotgroup' ? 'Pilot Group' : qr;
});

const hasCode = computed(() => code.value.some(char => char === ''));

const isUserOwned = computed(() =>
  !!(queryResult.value?.user_id &&
    UserStore().Cognito?.userId &&
    queryResult.value.user_id === UserStore().Cognito.userId)
);

const remoteItemExists = computed(() =>
  !!(queryResult.value &&
    UserStore().UserMetadata.RemoteItems?.some(
      (ri: string) => ri === queryResult.value.code || ri === code.value.join('')
    ))
);

const wrongType = computed(() => {
  const skipTypes = ['item', 'campaign', 'collection'];
  if (skipTypes.includes(props.importType)) return false;
  const npcTypes = ['npc', 'unit', 'eidolon', 'doodad'];
  if (props.importType === 'npc' && npcTypes.includes(qrImportType.value ?? '')) return false;
  const narrativeTypes = ['narrative', 'character', 'location', 'faction'];
  if (props.importType === 'narrative' && narrativeTypes.includes(qrImportType.value ?? '')) return false;
  return queryResult.value && qrImportType.value !== props.importType;
});

function initCode() {
  switch (props.importType.toLowerCase()) {
    case 'campaign': codeLength.value = 8; break;
    case 'collection': codeLength.value = 10; break;
    default: codeLength.value = 12;
  }
  code.value = Array(codeLength.value).fill('');
}

initCode();

function onInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  const value = input.value;
  if (value.length > 1) {
    code.value[index] = value[0];
    input.value = value[0];
  }
  if (code.value[index].length === 1 && index < codeLength.value - 1) {
    codeInputs.value[index + 1].focus();
  }
}

function onPaste(event: ClipboardEvent, index: number) {
  let pastedData = event.clipboardData?.getData('Text') || '';
  if (pastedData) {
    event.preventDefault();
    pastedData = pastedData.replace(/-/g, '');
    const pasteArray = pastedData.slice(0, codeLength.value).split('');
    pasteArray.forEach((char, i) => {
      if (index + i < codeLength.value) code.value[index + i] = char;
    });
    const nextIndex = Math.min(index + pasteArray.length, codeLength.value - 1);
    codeInputs.value[nextIndex]?.focus();
  } else {
    setTimeout(() => {
      const target = event.target as HTMLInputElement;
      const value = target.value.replace(/-/g, '');
      if (value.length > 1) {
        const pasteArray = value.slice(0, codeLength.value - index).split('');
        code.value[index] = '';
        target.value = '';
        pasteArray.forEach((char, i) => {
          if (index + i < codeLength.value) code.value[index + i] = char;
        });
        const nextIndex = Math.min(index + pasteArray.length, codeLength.value - 1);
        codeInputs.value[nextIndex]?.focus();
      }
    });
  }
}

function onBackspace(index: number) {
  if (code.value[index] === '' && index > 0) {
    code.value[index - 1] = '';
    codeInputs.value[index - 1].focus();
  }
}

async function getFromCode() {
  loading.value = true;
  const normalizedCode = code.value.join('').toUpperCase();
  try {
    queryResult.value = await GetFromCode(normalizedCode);
    emit('set-query-result', queryResult.value);
    emit('set-share-code', normalizedCode);
    if (props.importType === 'campaign') {
      const campaign = await downloadFromS3(queryResult.value.uri);
      emit('set-data', campaign);
    }
  } catch (err) {
    badCode.value = normalizedCode;
    queryResult.value = null;
    logger.error(`Error getting code: ${err}`, null, err);
  } finally {
    loading.value = false;
  }
}

function reset() {
  code.value = Array(codeLength.value).fill('');
  queryResult.value = null;
  badCode.value = '';
}

function formatCode(c: string) {
  if (c.length === 12) return c.slice(0, 4) + '-' + c.slice(4, 8) + '-' + c.slice(8, 12);
  if (c.length === 10) return c.slice(0, 5) + '-' + c.slice(5, 10);
  if (c.length === 8) return c.slice(0, 4) + '-' + c.slice(4, 8);
  return c;
}
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
