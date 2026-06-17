<template>
  <v-container>
    <div>
      <div v-if="item.SectionType.toLowerCase() !== 'section' && item.ItemNumber > 0"
        class="text-overline mt-n2 mb-n3">
        <b>{{ item.SectionType }} {{ item.ItemNumber }}:</b>
      </div>
      <cc-short-string-editor large
        @set="item.Title = $event">
        <span class="heading mech text-accent">
          {{ item.Title }}
        </span>
      </cc-short-string-editor>
    </div>
    <v-divider class="my-4" />
    <page-content-container v-for="(e, i) in item.Content"
      :key="`content-${i}`"
      :item="e"
      class="mb-4"
      @delete-item="item.RemoveContentItem(i)" />
    <v-footer color="transparent">
      <v-spacer />
      <v-btn color="accent"
        size="small"
        variant="tonal"
        prepend-icon="mdi-plus"
        @click="item.AddContentItem()">
        {{ $t('common.addContent') }}
      </v-btn>
    </v-footer>

    <v-footer app>
      <v-btn size="x-small"
        variant="tonal"
        class="mr-12"
        icon
        @click="$emit('preview', 'page')">
        <v-tooltip location="bottom"
          open-delay="300">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props"
              size="x-large"
              icon="mdi-eye" />
          </template>
          <span>{{ $t('common.preview') }}</span>
        </v-tooltip>
      </v-btn>
      <v-spacer />

      <section-add-menu :item="item" />

      <v-spacer />
      <v-menu y-offset
        :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            size="x-small"
            variant="tonal"
            class="mr-2"
            icon>
            <v-tooltip location="bottom"
              open-delay="300">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props"
                  size="x-large"
                  icon="mdi-tooltip-edit-outline" />
              </template>
              <span>{{ $t('gm.campaign.changeSectionType') }}</span>
            </v-tooltip>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-row dense>
              <v-col cols="auto"
                v-for="t in sectionTypes"
                :key="t">
                <v-btn variant="tonal"
                  size="small"
                  :color="item.SectionType === t ? 'secondary' : 'accent'"
                  @click="item.SectionType = t">
                  {{ t }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-menu>

      <v-menu y-offset
        :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn v-bind="props"
            size="x-small"
            variant="tonal"
            class="mr-2"
            icon>
            <v-tooltip location="bottom"
              open-delay="300">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props"
                  size="x-large"
                  icon="mdi-swap-vertical-bold" />
              </template>
              <span>{{ $t('gm.campaign.movePage') }}</span>
            </v-tooltip>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-row dense>
              <v-col cols="auto">
                <v-btn variant="tonal"
                  size="small"
                  color="accent"
                  prepend-icon="mdi-arrow-collapse-up"
                  @click="item.MoveToTop()">
                  {{ $t('gm.campaign.moveToTop') }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn variant="tonal"
                  size="small"
                  color="accent"
                  prepend-icon="mdi-arrow-up"
                  @click="item.MoveUp()">
                  {{ $t('gm.campaign.moveUp') }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn variant="tonal"
                  size="small"
                  color="accent"
                  prepend-icon="mdi-arrow-down"
                  @click="item.MoveDown()">
                  {{ $t('gm.campaign.moveDown') }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn variant="tonal"
                  size="small"
                  color="accent"
                  prepend-icon="mdi-arrow-collapse-down"
                  @click="item.MoveToBottom()">
                  {{ $t('gm.campaign.moveToBottom') }}
                </v-btn>
              </v-col>
            </v-row>

            <v-row align="center">
              <v-col>
                <v-select v-model="moveLoc"
                  :items="moveItems"
                  :item-title="(item) => item.Title"
                  return-object
                  :label="$t('gm.fields.moveIntoSection')"
                  hide-details
                  density="compact" />
              </v-col>
              <v-col cols="auto">
                <v-btn icon
                  variant="tonal"
                  size="small"
                  color="success"
                  @click="executeMove">
                  <v-icon icon="mdi-arrow-right-bold" />
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-menu>

      <v-btn size="x-small"
        variant="tonal"
        class="mr-2"
        icon
        @click="item.Duplicate()">
        <v-tooltip location="bottom"
          open-delay="300">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props"
              size="x-large"
              icon="mdi-content-copy" />
          </template>
          <span>{{ $t('common.duplicate') }}</span>
        </v-tooltip>
      </v-btn>

      <v-menu offset-y
        top>
        <template #activator="{ props }">
          <v-btn v-bind="props"
            size="x-small"
            variant="tonal"
            color="error"
            icon>
            <v-tooltip location="bottom"
              open-delay="300">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props"
                  size="x-large"
                  icon="mdi-delete" />
              </template>
              <span>{{ $t('common.delete') }}</span>
            </v-tooltip>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            {{ $t('gm.campaign.deletePageConfirm', { type: item.SectionType, title: item.Title }) }}
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn small
              color="error"
              @click="$emit('delete')">{{ $t('common.confirmDeletion') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-footer>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as _ from 'lodash-es';
import PageContentContainer from './_components/PageContentContainer.vue';
import sectionAddMenu from '../_components/sectionAddMenu.vue';

defineOptions({ name: 'campaign-editor-page' })

const props = defineProps<{
  item: object
}>()

const linkSelectDialog = ref(false)
const moveLoc = ref(null as any)
const encounterDialog = ref(false)
const sectionTypes = ref(['section', 'beat', 'mission', 'combat', 'downtime'])

const moveItems = computed(() => {
      let arr = [] as any[];
      if (props.item.Parent)
        arr = [{ Title: 'Campaign Root' }].concat(
          props.item.Campaign.ContentMoveLocations(props.item)
        );
      else arr = props.item.Campaign.ContentMoveLocations(props.item);

      return arr.filter((x) => _.isEqual(x, props.item.Parent) === false);
    })

function executeMove() {
      if (moveLoc.value) {
        if (moveLoc.value.Title === 'Campaign Root') props.item.MoveToCampaignRoot();
        else props.item.MoveToSection(moveLoc.value);
        moveLoc.value = null;
      }
    }
</script>
