<template>
  <v-container :class="mobile ? 'py-0 px-2' : 'px-12'" fluid>
    <v-row align="center">
      <v-col>
        <div class="heading h2">
          Search
          <cc-slashes />
          REFERENCE
        </div>
      </v-col>
      <v-col cols="auto">
        <cc-button
          color="accent"
          size="small"
          variant="outlined"
          :to="`/srd/compendium/search?search=${searchText}`">
          Switch to compendium search
        </cc-button>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <cc-text-field
          ref="input"
          v-model="searchText"
          color="primary"
          class="search-field"
          icon="mdi-magnify"
          placeholder="Search" />
      </v-col>
    </v-row>
    <i class="text-cc-overline">
      {{ searchResults.length }} result{{ searchResults.length === 1 ? '' : 's' }}
    </i>
    <v-card-text :style="!mobile && 'height: calc(100vh - 190px); overflow-y: scroll'">
      <v-slide-y-reverse-transition mode="out-in">
        <v-container>
          <v-card v-for="result in searchResults" class="py-2 px-3 mb-4">
            <v-row dense>
              <v-col>
                <div class="result-headline heading h4" v-html-safe="highlightText(result.title)" />
              </v-col>
              <v-col cols="auto" align-self="start">
                <cc-button
                  size="x-small"
                  color="primary"
                  append-icon="mdi-arrow-right"
                  @click="itemLink(result)">
                  {{ result.location.replace(/-|_/g, ' ') }}
                </cc-button>
              </v-col>
            </v-row>
            <v-card-text :class="!mobile && 'px-12'">
              <div class="result-body" v-html-safe="highlightText(result.content)" />
            </v-card-text>
          </v-card>
        </v-container>
      </v-slide-y-reverse-transition>
    </v-card-text>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import basics from '@/assets/srd/lib/basics.json';
import combat from '@/assets/srd/lib/combat.json';
import mechs from '@/assets/srd/lib/mechs.json';
import pilots from '@/assets/srd/lib/pilots.json';
import narrative_play from '@/assets/srd/lib/narrative_play.json';

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

function extract(str) {
  const pattern = '<span class="highlight">';
  const maxLength = 500;

  if (str.length <= maxLength) {
    return str;
  }

  const patternIndex = str.indexOf(pattern);

  if (patternIndex === -1) {
    return str.substring(0, maxLength);
  }

  let start = Math.max(0, patternIndex - Math.floor(maxLength / 2));
  let end = start + maxLength;

  if (end > str.length) {
    end = str.length;
    start = end - maxLength;
  }

  return str.substring(start, end);
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
    this.data = flatten(this.data);
  },
  watch: {
    searchText(newVal) {
      this.setSearch(newVal);
    },
  },
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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
  },
  methods: {
    highlightText(sourceText: string) {
      const text = sourceText.replace(/<[^>]*>/g, '');
      const regex = new RegExp(this.searchText, 'gi');
      let out = text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
      if (out.length > 500) {
        out = extract(out);
      }
      return out;
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
  background-color: rgba(255, 230, 0, 0.336);
}

.result-headline :deep(.highlight) {
  background-color: rgba(255, 230, 0, 0.3);
}
</style>
