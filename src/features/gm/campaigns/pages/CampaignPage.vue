<template>
  <v-container>
    <div>
      <div
        v-if="item.SectionType.toLowerCase() !== 'section' && item.ItemNumber > 0"
        class="text-overline mt-n2 mb-n3">
        <b>{{ item.SectionType }} {{ item.ItemNumber }}:</b>
      </div>
      <cc-short-string-editor large @set="item.Title = $event">
        <span class="heading mech text-accent">
          {{ item.Title }}
        </span>
      </cc-short-string-editor>
    </div>
    <v-divider class="my-4" />
    <page-content-container
      v-for="(e, i) in item.Content"
      :item="e"
      class="mb-4"
      @delete-item="item.RemoveContentItem(i)" />
    <v-footer color="transparent">
      <v-spacer />
      <v-btn
        color="accent"
        size="small"
        variant="tonal"
        prepend-icon="mdi-plus"
        @click="item.AddContentItem()">
        Add Content
      </v-btn>
    </v-footer>

    <v-footer app>
      <v-btn size="x-small" variant="tonal" class="mr-12" icon @click="$emit('preview', 'page')">
        <v-tooltip location="bottom" open-delay="300">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" size="x-large" icon="mdi-eye" />
          </template>
          <span>Preview</span>
        </v-tooltip>
      </v-btn>
      <v-spacer />

      <v-menu width="600px" location="center" y-offset>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            size="small"
            variant="tonal"
            prepend-icon="mdi-plus"
            :disabled="item.Depth >= 10">
            Add Subsection
          </v-btn>
        </template>
        <v-card variant="outlined" color="panel">
          <v-list density="compact" lines="three">
            <v-list-item
              title="Add Subsection"
              prepend-icon="mdi-page-next"
              subtitle="Add a new empty free-form section under this page. A Section is a container for other content items, and can be used to organize your campaign in any way you see fit."
              @click="item.AddChildSection()" />
            <v-list-item
              title="Add Beat"
              prepend-icon="mdi-metronome"
              subtitle="Add a new empty Beat under this section. A Beat is a section for an important event or moment in the story."
              @click="item.AddChildSection({ sectionType: 'beat' })" />
            <v-list-item
              title="Add Mission"
              prepend-icon="cc:orbit"
              subtitle="Add a new empty Mission under this page. A Mission contains specific goals and objectives that can be completed within a discrete period of time, and typically contains Combats."
              @click="item.AddChildSection({ sectionType: 'mission' })" />
            <v-list-item
              title="Add Combat"
              prepend-icon="cc:encounter"
              subtitle="Add a new empty Combat under this page. A Combat contains Encounters, as well as GM guidelines, narrative detail regarding the battle, and potential outcomes."
              @click="item.AddChildSection({ sectionType: 'combat' })" />
            <v-list-item
              title="Add Downtime"
              prepend-icon="cc:downtime"
              subtitle="Add a new empty Downtime under this page. Downtime is the narrative space between missions, where moment-to-moment action doesn't matter as much and roleplaying matters much more."
              @click="item.AddChildSection({ sectionType: 'downtime' })" />
          </v-list>
        </v-card>
      </v-menu>

      <v-spacer />
      <v-menu y-offset :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props" size="x-small" variant="tonal" class="mr-2" icon>
            <v-tooltip location="bottom" open-delay="300">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" icon="mdi-swap-vertical-bold" />
              </template>
              <span>Move Page</span>
            </v-tooltip>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-row dense>
              <v-col cols="auto">
                <v-btn
                  variant="tonal"
                  size="small"
                  color="accent"
                  prepend-icon="mdi-arrow-collapse-up"
                  @click="item.MoveToTop()">
                  move to top
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  variant="tonal"
                  size="small"
                  color="accent"
                  prepend-icon="mdi-arrow-up"
                  @click="item.MoveUp()">
                  move up
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  variant="tonal"
                  size="small"
                  color="accent"
                  prepend-icon="mdi-arrow-down"
                  @click="item.MoveDown()">
                  move down
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  variant="tonal"
                  size="small"
                  color="accent"
                  prepend-icon="mdi-arrow-collapse-down"
                  @click="item.MoveToBottom()">
                  move to bottom
                </v-btn>
              </v-col>
            </v-row>

            <v-row align="center">
              <v-col>
                <v-select
                  v-model="moveLoc"
                  :items="moveItems"
                  :item-title="(item) => item.Title"
                  return-object
                  label="Move into section"
                  hide-details
                  density="compact" />
              </v-col>
              <v-col cols="auto">
                <v-btn icon variant="tonal" size="small" color="success" @click="executeMove">
                  <v-icon icon="mdi-arrow-right-bold" />
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-menu>

      <v-btn size="x-small" variant="tonal" class="mr-2" icon @click="item.Duplicate()">
        <v-tooltip location="bottom" open-delay="300">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" size="x-large" icon="mdi-content-copy" />
          </template>
          <span>Duplicate</span>
        </v-tooltip>
      </v-btn>

      <v-menu offset-y top>
        <template #activator="{ props }">
          <v-btn v-bind="props" size="x-small" variant="tonal" color="error" icon>
            <v-tooltip location="bottom" open-delay="300">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="x-large" icon="mdi-delete" />
              </template>
              <span>Delete</span>
            </v-tooltip>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            Do you want to delete the {{ item.SectionType }} "{{ item.Title }}"? This action cannot
            be undone.
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn small color="error" @click="$emit('delete')">Confirm Deletion</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import _ from 'lodash';
import PageContentContainer from './_components/PageContentContainer.vue';

export default {
  name: 'campaign-editor-page',
  components: { PageContentContainer },
  props: {
    item: { type: Object, required: true },
  },
  data: () => ({
    linkSelectDialog: false,
    moveLoc: null as any,
    encounterDialog: false,
  }),
  computed: {
    moveItems() {
      let arr = [] as any[];
      if (this.item.Parent)
        arr = [{ Title: 'Campaign Root' }].concat(
          this.item.Campaign.ContentMoveLocations(this.item)
        );
      else arr = this.item.Campaign.ContentMoveLocations(this.item);

      return arr.filter((x) => _.isEqual(x, this.item.Parent) === false);
    },
  },
  methods: {
    executeMove() {
      if (this.moveLoc) {
        if (this.moveLoc.Title === 'Campaign Root') this.item.MoveToCampaignRoot();
        else this.item.MoveToSection(this.moveLoc);
        this.moveLoc = null;
      }
    },
  },
};
</script>
