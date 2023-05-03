<template>
  <v-container>
    <v-row align="center">
      <v-col
        ><div class="heading h2">Search<cc-slashes />REFERENCE</div></v-col
      >
      <v-col cols="auto"
        ><v-btn
          color="primary"
          size="small"
          variant="outlined"
          :to="`/srd/compendium/search?search=${searchText}`"
          >Switch to compendium search</v-btn
        ></v-col
      >
    </v-row>

    <v-row justify="center">
      <v-col cols="8">
        <v-text-field
          ref="input"
          :value="searchText"
          class="search-field"
          prepend-icon="mdi-search"
          solo
          hide-details
          single-line
          placeholder="Search"
          @update:modelValue="setSearch($event)"
        />
      </v-col>
    </v-row>
    <v-row class="mx-3">
      <v-col>
        <div>{{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }}</div>
        <v-slide-y-reverse-transition mode="out-in">
          <v-container>
            <div v-for="result in searchResults" class="pa-3">
              <v-card>
                <v-card-title>
                  <v-row dense>
                    <v-col>
                      <div class="result-headline" v-html-safe="highlightText(result.title)" />
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        size="x-small"
                        variant="flat"
                        color="primary"
                        @click="itemLink(result)"
                      >
                        {{ result.location.replace(/-|_/g, ' ') }}
                        <v-icon end icon="mdi-arrow-right" />
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text class="px-12">
                  <div class="result-body" v-html-safe="highlightText(result.content)" />
                </v-card-text>
              </v-card>
            </div>
          </v-container>
        </v-slide-y-reverse-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import basics from '@/assets/srd/lib/basics.json';
import combat from '@/assets/srd/lib/combat.json';
import mechs from '@/assets/srd/lib/mechs.json';
import pilots from '@/assets/srd/lib/pilots.json';
import narrative_play from '@/assets/srd/lib/narrative_play.json';
// import using_compcon from '@/assets/srd/lib/using_compcon.json';

function searchObject(obj, str) {
  const coll = [] as any[];
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      return searchObject(obj[key], str);
    }
    if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes(str)) {
      coll.push(obj);
    }
  }
  return coll;
}

function fillDataObject(data, refName) {
  const out = [] as any[];
  for (const key in data) {
    out.push({
      title: data[key].title.en,
      content: data[key].content.en,
      location: refName,
      children: data[key].children?.map((c: any) => ({
        title: c.title.en,
        content: c.content.en,
        location: refName,
        children: c.children?.map((cb: any) => ({
          title: cb.title.en,
          content: cb.content.en,
          location: refName,
        })),
      })),
    });
  }
  return out;
}

function flatten(data) {
  const out = [] as { title: string; content: string; location: string }[];
  data.forEach((e) => {
    out.push({
      title: e.title,
      content: e.content,
      location: e.location,
    });
    if (e.children) {
      out.push(...flatten(e.children));
    }
  });

  return out;
}

function countOccurrences(string, substring) {
  const regex = new RegExp(substring, 'gi');

  const matches = string.match(regex);

  return matches ? matches.length : 0;
}

export default {
  name: 'search-results',
  data: () => ({
    lang: 'en',
    searchText: '',
    data: [] as any[],
  }),
  created() {
    this.data = [
      ...fillDataObject(basics, 'basics'),
      // ...fillDataObject(using_compcon, 'compcon'),
      ...fillDataObject(combat, 'combat'),
      ...fillDataObject(mechs, 'mechs'),
      ...fillDataObject(pilots, 'pilots'),
      ...fillDataObject(narrative_play, 'narrative_play'),
    ];
    console.log(this.data);
    this.data = flatten(this.data);
    console.log(this.data);
  },
  computed: {
    searchResults(): any {
      if (this.searchText.length < 3) {
        return [];
      }

      let results = [] as any[];
      this.data.forEach((d) => {
        results = [...results, ...searchObject(d, this.searchText)];
      });

      results = _.uniqBy(results, 'title');

      return results.sort((a, b) => {
        const aCount = countOccurrences(a.title, this.searchText);
        const bCount = countOccurrences(b.title, this.searchText);
        const aContentCount = countOccurrences(a.content, this.searchText);
        const bContentCount = countOccurrences(b.content, this.searchText);

        // sort by title occurrences first, then content occurrences
        if (aCount !== bCount) {
          return bCount - aCount;
        } else {
          return bContentCount - aContentCount;
        }
      });
    },
  },
  mounted() {
    this.searchText = this.$route.query.search as string;
    const input = this.$refs.input as HTMLInputElement;
    input.focus();
  },
  methods: {
    highlightText(text: string) {
      const regex = new RegExp(this.searchText, 'gi');
      return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
    },
    setSearch(value: string) {
      if (value === this.searchText) {
        return;
      }
      this.searchText = value;
      this.$router.replace(`search?search=${value}`);
    },
    forceInput() {
      this.setSearch((this.$refs.input as HTMLInputElement as any).value);
    },
    itemLink(item: any) {
      // this.$router.push(`/srd/reference/${item.location}`);
      this.$router.push({
        name: `srd_${item.location}`,
        query: { preScroll: item.title },
      });
    },
  },
};
</script>

<style scoped>
.result-body :deep(.highlight) {
  background-color: yellow;
}

.result-headline :deep(.highlight) {
  background-color: yellow;
}
</style>
