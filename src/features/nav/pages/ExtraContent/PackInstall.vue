<template>
  <v-card-text :style="mobile ? 'margin-top: 24px; padding: 8px' : 'margin-top: 8px'">
    <v-row class="packInstaller" style="height: 100%">
      <v-col
        :style="mobile ? '' : 'height: calc(95vh - 83px)'"
        style="overflow-y: scroll"
        cols="12"
        md="4"
        class="px-3 py-4">
        <v-file-input
          v-model="value"
          placeholder="Select an .LCP file"
          variant="outlined"
          type="file"
          accept=".lcp"
          prepend-icon="cc:content_manager"
          clearable
          multiple
          clear-icon="mdi-close"
          tile
          chips
          density="compact"
          @click:clear="reset()"
          @change="fileChange($event)" />
        <cc-button
          block
          type="flat"
          size="small"
          :disabled="disableInstall"
          color="primary"
          @click="install">
          <template #info>
            <v-icon icon="mdi-tray-arrow-down" />
          </template>

          <span>Install</span>
        </cc-button>
        <cc-alert v-if="hasAlreadyInstalled" color="warning" class="my-3">
          <span class="text-caption">
            The following content pack(s) are already installed and will be replaced:
          </span>
          <div
            v-for="pack in contentPacks.filter((x) => packAlreadyInstalled(x))"
            :key="pack.id"
            class="text-caption">
            <b>{{ pack.manifest.name }}</b>
            by {{ pack.manifest.author }} @ {{ alreadyInstalledVersion(pack) }}
            <div class="ml-3 mb-2" style="margin-top: -2px">
              <v-chip
                v-if="gradeType(pack) === 'upgrade'"
                color="success"
                size="x-small"
                variant="elevated"
                class="elevation-0">
                <v-icon start icon="mdi-arrow-up" />
                Upgrade from {{ alreadyInstalledVersion(pack) }} to {{ pack.manifest.version }}
              </v-chip>
              <v-chip
                color="error"
                size="x-small"
                variant="elevated"
                class="elevation-0"
                v-else-if="gradeType(pack) === 'downgrade'">
                <v-icon start icon="mdi-arrow-down" />
                Downgrade to {{ pack.manifest.version }}
              </v-chip>
              <i v-else>
                <v-icon class="pb-1" icon="mdi-swap-horizontal" />
                No change ({{ pack.manifest.version }} to {{ pack.manifest.version }})
              </i>
            </div>
          </div>
        </cc-alert>

        <cc-alert v-if="hasUninstalledDependencies" color="error" class="my-3">
          <span class="text-caption">
            The following content pack(s) have uninstalled dependencies and cannot be installed yet.
            They will be skipped:
          </span>
          <div
            v-for="pack in contentPacks.filter((x) => uninstalledDependencies(x).length > 0)"
            :key="pack.id"
            class="text-caption">
            <b>{{ pack.manifest.name }}</b>
            by {{ pack.manifest.author }} requires
            <div v-for="dep in uninstalledDependencies(pack)" :key="dep.id" class="text-caption">
              <v-chip
                size="x-small"
                variant="elevated"
                class="elevation-0"
                @click="openLink(dep.link)">
                {{ dep.name }} @ {{ parseVersion(dep.version) }}
              </v-chip>
            </div>
          </div>
        </cc-alert>

        <v-fade-transition mode="out-in">
          <cc-alert v-if="installing" type="info" class="mt-3">
            Installing {{ contentPacks.length }} content pack(s)...
          </cc-alert>
        </v-fade-transition>

        <p v-if="error" style="color: red">{{ error }}</p>
      </v-col>
      <v-divider v-if="!mobile" vertical class="mx-3" />
      <v-col
        class="px-3 py-4"
        :style="mobile ? '' : 'height: calc(95vh - 83px)'"
        style="overflow-y: scroll">
        <v-fade-transition mode="out-in" v-for="contentPack in contentPacks">
          <div v-if="contentPack" :key="contentPack.id" class="mb-4">
            <pack-info :pack="contentPack" />
            <v-alert
              v-show="packAlreadyInstalled(contentPack) && !installing"
              flat
              tile
              :color="
                gradeType(contentPack) === 'upgrade'
                  ? 'success'
                  : gradeType(contentPack) === 'downgrade'
                    ? 'error'
                    : ''
              "
              class="transition-swing"
              transition="slide-y-reverse-transition">
              A pack with this same name and author is already installed.
              <span v-if="gradeType(contentPack) === 'upgrade'">
                It will be upgraded to v.{{ contentPack.manifest.version }}
              </span>
              <span v-else-if="gradeType(contentPack) === 'downgrade'">
                It will be downgraded to {{ contentPack.manifest.version }}
              </span>
              <span v-else>It will be replaced by this copy.</span>
            </v-alert>
            <v-alert
              v-show="uninstalledDependencies(contentPack).length > 0 && !installing"
              flat
              tile
              color="error"
              class="transition-swing"
              transition="slide-y-reverse-transition">
              This LCP requires the following content to be installed before it can be added:
              <div
                v-for="dep in uninstalledDependencies(contentPack)"
                :key="dep.id"
                class="text-caption">
                <v-chip size="small">{{ dep.name }}</v-chip>
                @ {{ parseVersion(dep.version) }}
                <v-btn
                  v-if="dep.link"
                  icon
                  variant="plain"
                  size="x-small"
                  @click="openLink(dep.link)">
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </div>
            </v-alert>
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
import { ContentPack, IContentPack } from '@/classes/ContentPack';

import { compare, coerce } from 'semver';
import { set } from 'lodash';
import logger from '@/user/logger';

export default {
  name: 'PackInstall',
  components: { PackInfo },
  data: () => ({
    value: null,
    installing: false,
    contentPacks: [] as IContentPack[],
    error: '',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    hasAlreadyInstalled() {
      return this.contentPacks.some((pack) => this.packAlreadyInstalled(pack));
    },
    hasUninstalledDependencies() {
      if (!this.contentPacks.length) return false;
      return this.contentPacks.some((pack) => this.uninstalledDependencies(pack).length > 0);
    },
    disableInstall() {
      return (
        this.installing ||
        this.contentPacks.length === 0 ||
        this.contentPacks.filter((pack) => this.uninstalledDependencies(pack).length > 0).length ===
          this.contentPacks.length
      );
    },
  },
  methods: {
    async reset() {
      this.contentPacks = [];
      this.error = '';
      this.value = null;
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
    async fileChange(event) {
      const files = event.target.files;
      if (files?.length) {
        for (let i = 0; i < files.length; i++) {
          await this.readFileAsBinaryString(files[i]);
        }
      }
    },
    async readFileAsBinaryString(file) {
      try {
        const fileData = await this.readAsBinaryStringAsync(file);
        const pack = await parseContentPack(fileData as string);
        this.contentPacks.push(pack);
      } catch (error) {
        logger.error(`Error reading file: ${error}`, this);
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
      if (this.installing) return;
      this.$emit('start-load');
      this.installing = true;
      const promises = [] as Promise<void>[];
      this.contentPacks.forEach((contentPack) => {
        if (!this.uninstalledDependencies(contentPack).length) {
          contentPack.active = true;
          promises.push(CompendiumStore().installContentPack(contentPack));
        } else {
          logger.warn(
            `Skipping ${contentPack.manifest.name} due to uninstalled dependencies.`,
            this
          );
        }
      });
      await Promise.all(promises);
      this.installing = false;

      this.contentPacks = [];
      this.error = '';
      this.value = null;

      this.$notify({
        title: 'Success',
        text: 'Content packs installed successfully',
        data: { color: 'success' },
      });
    },
    packAlreadyInstalled(pack) {
      return CompendiumStore().packAlreadyInstalled(pack.id);
    },
    alreadyInstalledVersion(pack) {
      return CompendiumStore().ContentPacks.find((x) => x.ID === pack.id)?.Version || '0';
    },
    uninstalledDependencies(pack) {
      const deps = pack.manifest ? pack.manifest.dependencies : [];
      if (!deps) return [];
      return deps.filter(
        (dep) => !CompendiumStore().packAlreadyInstalled(dep.name, dep.version, true)
      );
    },
    gradeType(pack) {
      const installed = this.alreadyInstalledVersion(pack);
      const staged = pack.manifest.version || '0';
      const c = compare(coerce(installed), coerce(staged));
      if (c === -1) return 'upgrade';
      if (c === 0) return 'same';
      if (c === 1) return 'downgrade';
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
