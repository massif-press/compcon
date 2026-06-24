<template>
  <v-row dense align="start">
    <v-col cols="3">
      <div class="heading h4 text-accent">{{ collection.name }}</div>
      <div class="text-caption">{{ $t("mainMenu.collection.byAuthor", { author: collection.author }) }}</div>
      <div class="text-caption">
        v. {{ collection.version }}
        <cc-slashes />
        {{ new Date(collection.updated).toLocaleString() }}
      </div>
    </v-col>
    <v-col>
      <p v-text="collection.description" />
      <v-divider class="my-1" />
      <div class="text-caption">{{ $t("common.contents") }}</div>
      <v-table density="compact">
        <thead class="bg-primary heading">
          <tr>
            <th>{{ $t("common.name") }}</th>
            <th>{{ $t("common.type") }}</th>
            <th>{{ $t("active.labels.lastUpdate") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(content, contentIdx) in JSON.parse(collection.contents)" :key="`content-${contentIdx}`">
            <td>{{ content.name }}</td>
            <td>{{ content.item_type }}</td>
            <td>{{ new Date(content.last_updated).toLocaleString() }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="text-caption mt-2">{{ $t("common.changelog") }}</div>
      <v-table density="compact">
        <thead class="bg-primary heading">
          <tr>
            <th>{{ $t("common.version") }}</th>
            <th>{{ $t("mainMenu.collection.colChanges") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(content, contentIdx) in sortedChangelog(collection.changelog)" :key="`changelog-${contentIdx}`">
            <td>{{ content.version }}</td>
            <td v-html-safe="content.changes.join('<br>')" />
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="text-right">
              <v-btn
                v-if="JSON.parse(collection.changelog).length > 3"
                variant="tonal"
                color="accent"
                size="x-small"
                @click="showMore = !showMore">
                {{ showMore ? $t("mainMenu.collection.showLess") : $t("mainMenu.collection.showMore") }}
              </v-btn>
            </td>
          </tr>
        </tfoot>
      </v-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'collection-info' })

const props = defineProps<{
  collection: object
}>()

const showMore = ref(false)

function sortedChangelog(changelog: string) {
      let log = JSON.parse(changelog).sort((a: any, b: any) => b.version - a.version);
      if (!showMore.value) {
        return log.slice(0, 3);
      } else {
        return log.slice(0, 10);
      }
    }
</script>
