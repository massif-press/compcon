<template>
  <v-card-text :style="mobile ? 'margin-top: 24px; padding: 8px' : 'margin-top: 32px'">
    <v-row class="packInstaller" style="height: 100%">
      <v-col style="height: 100%" cols="12" md="3" class="px-3 py-4">
        <v-file-input
          v-model="value"
          placeholder="Select an .LCP file"
          variant="outlined"
          type="file"
          accept=".lcp"
          prepend-inner-icon="cc:content_manager"
          clearable
          clear-icon="mdi-close"
          tile
          density="compact"
          @click:clear="reset()"
          @change="fileChange($event)" />
        <cc-button
          block
          type="flat"
          size="small"
          :disabled="!contentPack || installing || uninstalledDependencies.length > 0"
          :color="done ? 'success' : 'primary'"
          @click="install">
          <template #info>
            <v-icon icon="mdi-tray-arrow-down" />
          </template>
          <v-fade-transition mode="out-in">
            <svg
              v-show="done"
              class="check"
              xmlns="http://www.w3.org/2000/svg"
              width="32px"
              height="32px"
              viewBox="0 0 154 154">
              <polyline
                points="43.5,77.8 63.7,97.9 112.2,49.4 "
                style="stroke: white; fill: none; stroke-width: 12px" />
            </svg>
          </v-fade-transition>
          <span v-show="!done">{{ packAlreadyInstalled ? 'Replace' : 'Install' }}</span>
        </cc-button>
        <p v-if="error" style="color: red">{{ error }}</p>
        <cc-alert
          v-show="packAlreadyInstalled && !(installing || done)"
          color="info"
          class="transition-swing"
          transition="slide-y-reverse-transition">
          A pack with this same name and author is already installed. It will be replaced by this
          copy.
        </cc-alert>
        <cc-alert
          v-show="uninstalledDependencies.length > 0 && !(installing || done)"
          color="error"
          class="transition-swing"
          transition="slide-y-reverse-transition">
          This LCP requires the following content to be installed before it can be added:
          <div v-for="dep in uninstalledDependencies" :key="dep.id" class="text-caption">
            <v-chip size="small">{{ dep.name }}</v-chip>
            @ {{ parseVersion(dep.version) }}
            <v-btn v-if="dep.link" icon variant="plain" size="x-small" @click="openLink(dep.link)">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </cc-alert>
      </v-col>
      <v-divider v-if="!mobile" vertical class="mx-3" />
      <v-col class="px-3 py-4" :style="mobile ? '' : 'height: calc(95vh - 83px)'">
        <v-fade-transition mode="out-in">
          <div v-if="contentPack" key="pack">
            <pack-info :pack="contentPack" />
          </div>
          <div v-else key="nopack" class="text-center my-6">
            <div class="heading h3 font-italic text-disabled">No content pack selected</div>
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import { parseContentPack } from '@/io/ContentPackParser';

import { CompendiumStore } from '@/stores';

import PackInfo from './PackInfo.vue';
import { IContentPack } from '@/classes/ContentPack';

export default {
  name: 'PackInstall',
  components: { PackInfo },
  data: () => ({
    value: null,
    installing: false,
    done: false,
    contentPack: null as unknown as IContentPack,
    error: '',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    packAlreadyInstalled() {
      return !!this.contentPack && CompendiumStore().packAlreadyInstalled(this.contentPack.id);
    },
    uninstalledDependencies() {
      if (!this.contentPack) return [];
      const pack = this.contentPack as any;
      const deps = pack.manifest ? pack.manifest.dependencies : [];
      if (!deps) return [];
      return deps.filter((dep) => !CompendiumStore().packAlreadyInstalled(dep.name, dep.version));
    },
  },
  methods: {
    async reset() {
      this.contentPack = null as unknown as IContentPack;
      this.error = '';
      this.value = null;
      this.done = false;
      await this.$nextTick();
    },
    openLink(link) {
      window.open(link, '_blank');
    },
    parseVersion(version) {
      if (version.includes('*')) return 'any version';
      if (version.includes('=')) return version.replace('=', '');
      return version + ' or later';
    },
    fileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.readFileAsBinaryString(file);
      }
    },
    async readFileAsBinaryString(file) {
      try {
        const fileData = await this.readAsBinaryStringAsync(file);
        this.contentPack = await parseContentPack(fileData as string);
      } catch (error) {
        console.error('Error reading the file:', error);
      }
    },
    readAsBinaryStringAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsBinaryString(file);
      });
    },
    async install(): Promise<void> {
      if (this.done || this.installing) return;
      this.$emit('start-load');
      this.installing = true;
      this.contentPack.active = true;
      await CompendiumStore().installContentPack(this.contentPack);
      this.installing = false;

      this.done = true;
      setTimeout(() => {
        this.$emit('installed');
        this.contentPack = null as unknown as IContentPack;
        this.error = '';
        this.value = null;
        this.done = false;
        this.$emit('end-load');
      }, 500);
    },
  },
};
</script>

<style scoped>
.packInstaller :deep(.v-btn) {
  transition: background-color 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
}

.check {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: dash 750ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
