<template>
  <v-row dense align="start">
    <v-col cols="3">
      <div class="heading h4 text-accent">{{ collection.name }}</div>
      <div class="text-caption">By {{ collection.author }}</div>
      <div class="text-caption">
        v. {{ collection.version }}
        <cc-slashes />
        {{ new Date(collection.updated).toLocaleString() }}
      </div>
    </v-col>
    <v-col>
      <p v-text="collection.description" />
      <v-divider class="my-1" />
      <div class="text-caption">CONTENTS</div>
      <v-table density="compact">
        <thead class="bg-primary heading">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="content in JSON.parse(collection.contents)">
            <td>{{ content.name }}</td>
            <td>{{ content.item_type }}</td>
            <td>{{ new Date(content.last_updated).toLocaleString() }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="text-caption mt-2">CHANGELOG</div>
      <v-table density="compact">
        <thead class="bg-primary heading">
          <tr>
            <th>Version</th>
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="content in sortedChangelog(collection.changelog)">
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
                {{ showMore ? 'Show Less' : 'Show More' }}
              </v-btn>
            </td>
          </tr>
        </tfoot>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'collection-info',
  props: {
    collection: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    showMore: false,
  }),
  methods: {
    sortedChangelog(changelog: string) {
      let log = JSON.parse(changelog).sort((a: any, b: any) => b.version - a.version);
      if (!this.showMore) {
        return log.slice(0, 3);
      } else {
        return log.slice(0, 10);
      }
    },
  },
};
</script>
