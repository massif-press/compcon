<template>
  <div v-if="loading" class="text-center">
    <v-progress-circular indeterminate color="primary" size="64" />
  </div>
  <v-layout v-else>
    <v-main style="position: relative">
      <div
        style="position: fixed; z-index: 999"
        :style="`left: ${showNav ? (mobile ? '286' : '352') : '3'}px; top: 6px; margin-top: ${mobile ? '24px' : '40px'}`">
        <cc-button
          :icon="showNav ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'"
          size="small"
          color="primary"
          @click="showNav = !showNav" />
      </div>
      <v-navigation-drawer
        nav
        v-model="showNav"
        :width="mobile ? '280' : '350'"
        style="overflow-y: scroll"
        :style="[
          mobile ? 'height:98vh; top:20px' : 'height: 95.5vh; top: 40px',
          showNav && ' position: fixed',
        ]">
        <v-list density="compact" slim nav>
          <v-list-group v-for="b in books" no-action color="accent">
            <template v-slot:activator="{ props }">
              <v-list-item
                class="heading text-uppercase"
                v-bind="props"
                :title="b"
                prepend-icon="cc:content_manager" />
            </template>

            <v-list-item
              v-for="item in faq.filter((x) => x.book === b)"
              :title="item.title"
              @click="() => scrollTo(item.title)" />
          </v-list-group>
        </v-list>
      </v-navigation-drawer>
      <h1 class="heading h1 ml-8">FAQ & ERRATA</h1>
      <v-container>
        <cc-alert color="panel" class="mb-5">
          <div class="heading h4">Please note:</div>
          <div>
            This FAQ and Errata is a community-driven project and is not part of an official Massif
            Press LANCER release. This page is furnished by FAQ data from the
            <v-chip
              tile
              variant="tonal"
              size="small"
              href="https://github.com/aritsune/lancer-faq"
              target="_blank">
              lancer-faq repository
            </v-chip>
            on GitHub, currently maintained by lenaleciel. This document is also available at
            <v-chip
              tile
              variant="tonal"
              size="small"
              href="https://lancer-faq.netlify.app/"
              target="_blank">
              lancer-faq.netlify.app/
            </v-chip>
            .
          </div>
        </cc-alert>
        <v-card v-for="(faq, i) in faq" flat tile class="mb-5">
          <v-toolbar
            density="compact"
            color="primary"
            height="42"
            class="px-3"
            :extended="mobile"
            extension-height="28">
            <div :id="faq.title" class="heading h3">
              {{ faq.title }}
            </div>
            <v-spacer />
            <div class="text-cc-overline" v-if="faq.page && !mobile">
              {{ faq.book }}, p. {{ faq.page }}
            </div>
            <template v-if="mobile" #extension>
              <div class="text-cc-overline">{{ faq.book }}, p. {{ faq.page }}</div>
            </template>
          </v-toolbar>
          <v-card-text v-for="(child, j) in faq.children" :key="j">
            <div class="font-weight-bold body-text">{{ child.title }}</div>
            <v-card-text v-html-safe="cMarkdown(child.body)" />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>
import logger from '@/user/logger';
import { marked } from 'marked';

export default {
  name: 'errata',
  data: () => ({
    faq: '',
    loading: true,
    showNav: false,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    books() {
      return new Set(this.faq.map((item) => item.book));
    },
  },
  async mounted() {
    this.showNav = !this.mobile;
    const res = await fetch(
      'https://raw.githubusercontent.com/aritsune/lancer-faq/refs/heads/master/src/index.md'
    );
    if (res.ok) {
      let text = await res.text();
      text = this.sanitize(text);
      text = this.convertToJson(text);
      this.faq = this.srdFormat(text[0].children);
    } else logger.error(`Error fetching FAQ data: ${res.statusText}`, this);
    this.loading = false;
  },
  methods: {
    sanitize(text) {
      let out = text;

      // remove all <wot:*> tags
      out = out.replace(/<wot:.*?>/g, '');

      return out;
    },
    convertToJson(markdown) {
      const lines = markdown.split('\n');
      const root = { children: [] };
      const stack = [root];

      lines.forEach((line) => {
        const match = line.match(/^(#{1,6})\s+(.*)/); // Match headers (#, ##, ###, etc.)

        if (match) {
          const level = match[1].length; // Determine heading level
          const text = match[2].trim();
          const node = { heading: text, children: [] };

          while (stack.length > level) stack.pop(); // Adjust stack for hierarchy

          stack[stack.length - 1].children.push(node);
          stack.push(node);
        } else if (line.trim() !== '') {
          // Add text to the latest heading's body
          if (!stack[stack.length - 1].body) stack[stack.length - 1].body = '';
          stack[stack.length - 1].body += (stack[stack.length - 1].body ? '\n' : '') + line.trim();
        }
      });

      return root.children;
    },
    srdFormat(arr) {
      return arr.map((item) => {
        let out = {
          book: 'Lancer Core Book',
        };
        const titleMatch = item.heading.match(/^page (\d+), (.+)$/i);
        if (titleMatch) {
          out.page = titleMatch[1];
          out.title = titleMatch[2];
        } else {
          // capture expansion book and page number
          const extraMatch = item.heading.match(/^(.+?)(?:\s*page\s*)?(\d+),\s*(.+)$/i); // Non-capturing group for optional "page"
          if (extraMatch) {
            out.book = extraMatch[1].trim();
            out.page = parseInt(extraMatch[2], 10);
            out.title = extraMatch[3].trim();
          } else out.title = item.heading;
        }

        out.body = item.body;
        if (item.children.length) out.children = this.srdFormat(item.children);
        return out;
      });
    },
    cMarkdown(str) {
      return marked(str);
    },
    scrollTo(id) {
      const el = document.getElementById(id);
      const offset = 50;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    },
  },
};
</script>
