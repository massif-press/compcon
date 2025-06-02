<template>
  <v-card-text :class="mobile && 'px-0'">
    <cc-alert prominent density="compact" icon="mdi-alert">
      Share codes allow anyone to view COMP/CON data and receive updates the author makes. Neither
      Massif Press nor the developer of COMP/CON are responsible for any shared content. Please be
      conscientious when sharing data with others.
    </cc-alert>
    <div v-if="pilot.CloudController.ShareCode" :class="mobile && 'text-center'">
      <v-row justify="center">
        <v-col cols="auto">
          <div class="text-cc-overline mt-4">
            PILOT SHARE CODE
            <v-tooltip>
              <template #activator="{ props }">
                <v-icon v-bind="props" icon="mdi-information-slab-box-outline" size="x-large" />
              </template>
              <div>
                This link will allow other users with a COMP/CON account to save a copy of this
                pilot to their pilot roster and subscribe to updates you make.
              </div>
            </v-tooltip>
          </div>
          <b
            class="text-accent"
            style="font-size: calc(30px + 2vw)"
            v-text="
              `${pilot.CloudController.ShareCode.slice(0, 4)}-${pilot.CloudController.ShareCode.slice(4, 8)}-${pilot.CloudController.ShareCode.slice(8, 12)}`
            " />
          <v-tooltip text="Copy share code to clipboard">
            <template #activator="{ props }">
              <v-icon v-bind="props" @click.stop="copy()">mdi-clipboard-text-outline</v-icon>
            </template>
          </v-tooltip>
          <fieldset class="px-2 pb-2">
            <legend class="text-cc-overline mt-4 mx-3 px-2">
              SHARE LINK
              <v-tooltip>
                <template #activator="{ props }">
                  <v-icon v-bind="props" icon="mdi-information-slab-box-outline" size="x-large" />
                </template>
                <div>
                  This link is a
                  <b class="text-accent">publicly accessible URL</b>
                  that allows anyone to view this pilot's data.
                </div>
              </v-tooltip>
            </legend>
            <v-row no-gutters align="end">
              <v-col>
                <v-text-field
                  v-model="shareLink"
                  readonly
                  flat
                  tile
                  density="compact"
                  hide-details
                  class="my-1"
                  @click="copyShareLink()"
                  style="font-size: calc(16px + 0.5vw)" />
              </v-col>
              <v-col cols="auto">
                <v-tooltip text="Copy share link to clipboard">
                  <template #activator="{ props }">
                    <v-icon v-bind="props" @click.stop="copyShareLink()">
                      mdi-clipboard-text-outline
                    </v-icon>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>

            <v-row dense align="center">
              <v-col>
                <div class="text-cc-overline">SHEET STYLE</div>
                <cc-select
                  v-model="linkStyle"
                  density="compact"
                  hide-details
                  chip-variant="text"
                  :items="[
                    { title: 'Full', value: 'full' },
                    { title: 'Build Only', value: 'build' },
                  ]" />
              </v-col>
              <v-col>
                <div class="text-cc-overline">INCLUDE MECH</div>

                <cc-select
                  v-model="shareMech"
                  density="compact"
                  chip-variant="text"
                  :items="mechOptions" />
              </v-col>
            </v-row>
          </fieldset>
        </v-col>
      </v-row>
    </div>
    <v-alert v-else prominent color="warning" tile class="mt-4 text-center">
      This pilot does not have a share code. To share this pilot, you must first upload it to your
      cloud account.
    </v-alert>
  </v-card-text>
</template>

<script lang="ts">
export default {
  name: 'share-dialog',
  props: {
    pilot: { type: Object, required: true },
  },
  data: () => ({
    linkStyle: 'full',
    shareMech: '',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    shareLink() {
      return `https://dev.compcon.app/link/pilot/${this.pilot.CloudController.ShareCode}/${this.linkStyle}/${this.shareMech}`;
    },
    mechOptions() {
      const arr = [{ title: 'None', value: '' }];
      arr.push(
        ...this.pilot.Mechs.map((m) => ({
          title: `${m.Name} (${m.Frame.Source} ${m.Frame.Name})`,
          value: m.ID,
        }))
      );
      return arr;
    },
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.pilot.CloudController.ShareCode);
    },
    copyShareLink() {
      navigator.clipboard.writeText(this.shareLink);
    },
  },
};
</script>
