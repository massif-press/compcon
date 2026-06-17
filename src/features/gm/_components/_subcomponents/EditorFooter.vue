<template>
  <v-footer app
    color="surface"
    class="px-3"
    :class="mobile && 'mb-1'"
    :height="mobile ? 28 : 'auto'">
    <v-menu v-model="deleteMenu"
      max-width="500px">
      <template #activator="{ props }">
        <cc-button prepend-icon="mdi-delete"
          :size="mobile ? 'x-small' : 'small'"
          color="error"
          v-bind="props">
          {{ $t('common.delete') }}
        </cc-button>
      </template>
      <v-card-text>
        <cc-confirmation
          content="This will delete this NPC from your NPC roster. NPCs of this type added to Encounters will not be affected. Are you sure?"
          @confirm="deleteItem()" />
      </v-card-text>
    </v-menu>

    <v-spacer />

    <cc-button prepend-icon="mdi-printer"
      :size="mobile ? 'x-small' : 'small'"
      @click="$emit('print', item.ID)">
      {{ $t('common.print') }}
    </cc-button>
    <cc-button prepend-icon="mdi-upload"
      :size="mobile ? 'x-small' : 'small'"
      class="ml-2"
      @click="$emit('export', item)">
      {{ $t('common.export') }}
    </cc-button>
    <slot name="footer" />

    <cc-dialog v-if="!isRemote && isAuthed"
      :title="$t('common.shareCode')"
      icon="mdi-broadcast"
      :close-on-click="false">
      <template #activator="{ open }">
        <cc-button color="panel"
          class="mx-2"
          :size="mobile ? 'x-small' : 'small'"
          @click="open">
          <v-icon start
            icon="mdi-broadcast" />
          {{ $t('common.shareCode') }}
        </cc-button>
      </template>
      <share-dialog :item="item" />
    </cc-dialog>
    <v-spacer v-if="!isRemote && isAuthed" />

    <v-menu v-if="isRemote"
      v-model="convertMenu"
      offset-y
      offset-x
      top
      left>
      <template #activator="{ props }">
        <cc-button :size="mobile ? 'x-small' : 'small'"
          class="mx-3"
          v-bind="props">
          <v-icon start
            icon="mdi-content-copy" />
          {{ $t('common.convert') }}
        </cc-button>
      </template>
      <cc-confirmation content="Converting this item to local data will allow local editing but remove its remote link to the
      author's cloud account, and prevent any further updates from being received. To re-enable
      remote syncing, you will have to re-import this item via its share code."
        @confirm="$emit('convert')" />
    </v-menu>

    <v-tooltip v-if="isRemote">
      <template #activator="{ props }">
        <cc-button :size="mobile ? 'x-small' : 'small'"
          :disabled="item.CloudController.isSynced"
          class="mx-3"
          v-bind="props">
          <v-icon start>mdi-cloud-sync</v-icon>
          {{ $t('common.update') }}
        </cc-button>
      </template>
      {{
        isAuthed
          ? item.CloudController.isSynced
            ? $t('gm.editorFooter.upToDate')
            : $t('gm.editorFooter.downloadRemote')
          : $t('gm.editorFooter.mustLogin')
      }}
    </v-tooltip>

    <v-menu v-if="!isRemote"
      v-model="dupeMenu"
      offset-y
      offset-x
      top
      left>
      <template #activator="{ props }">
        <cc-button :size="mobile ? 'x-small' : 'small'"
          class="ml-3"
          v-bind="props">
          <v-icon start
            icon="mdi-content-copy" />
          {{ $t('common.duplicate') }}
        </cc-button>
      </template>
      <cc-confirmation content="Confirm duplication of this NPC"
        @confirm="dupe()" />
    </v-menu>

    <cc-button v-if="isRemote"
      variant="tonal"
      :size="mobile ? 'x-small' : 'small'"
      color="secondary"
      class="mx-3"
      @click="$emit('exit')">
      <v-icon start
        icon="mdi-arrow-left" />
      {{ $t('common.exit') }}
    </cc-button>
  </v-footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NpcStore, UserStore } from '@/stores';
import { useDisplay } from 'vuetify';
import ShareDialog from '@/shared/ShareDialog.vue';

defineOptions({ name: 'GmEditorFooter' })

const { smAndDown: mobile, xs: portrait } = useDisplay()

const props = withDefaults(defineProps<{
  item: object
  readonly?: boolean
  hideToolbar?: boolean
}>(), {
  readonly: false,
  hideToolbar: false
})

const emit = defineEmits<{
  'exit': []
  'export': []
  'convert': []
  'print': []
}>()

const deleteMenu = ref(false)
const dupeMenu = ref(false)
const convertMenu = ref(false)

const isRemote = computed(() => {
      return props.item.SaveController.IsRemote;
    })
const isAuthed = computed(() => {
      return UserStore().IsLoggedIn;
    })

async function save() {
      await props.item.SaveController.Save();
    }
function deleteItem() {
      props.item.SaveController.Delete();
      deleteMenu.value = false;
      emit('exit');
    }
function dupe() {
      const dupe = props.item.Clone();
      NpcStore().AddNpc(dupe);
      dupeMenu.value = false;
    }
</script>
