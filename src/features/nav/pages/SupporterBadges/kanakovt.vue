<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <v-col cols="12">
    <v-card variant="tonal"
      class="rounded-ts-xl rounded-be-xl brand-styles">
      <img class="banner"
        alt="Kana Banner"
        src="/img/misc/supporters/kana_banner.png">
      <v-card-text class="pa-1"
        style="position: relative; z-index: 1">
        <v-row align="center">
          <v-col cols="auto">
            <v-avatar size="10y0px">
              <v-img src="/img/misc/supporters/kana_av.png"
                alt="kanakovt" />
            </v-avatar>
          </v-col>
          <v-col>
            <div class="heading h2 mb-1"
              style="color: #f2f1fd;  text-shadow: 2px 2px 2px #23273b;">
              Kana
            </div>
            <div style="background-color: #23273b; border-radius: 19px; width: fit-content;"
              class="px-3 py-1 mt-n1">
              <a target="_blank"
                class="mr-4"
                :href="`https://kanavt.com/`">
                <v-icon icon="mdi-web"
                  color="#f6609a" />
                <span style="color: #ffdeb9"> https://kanavt.com </span>
              </a>

              <a target="_blank"
                class="mr-4"
                :href="`https://x.com/kanakovt`">
                <v-icon icon="mdi-twitter" />
                <span style="color: #ffdeb9"> @kanakovt</span>
              </a>

              <a target="_blank"
                :href="`https://x.com/kanakovt`">
                <v-icon icon="mdi-twitch" />
                <span style="color: #ffdeb9"> @kanakovt</span>
              </a>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<style scoped>
a,
a:visited {
  text-decoration: none !important;
  color: inherit;
}

.brand-styles {
  background: linear-gradient(90deg, #f6609a 0%, #ffdeb9 100%), #1E1E1E;
  border: 5px solid #ffcace;
  position: relative;
  overflow: hidden;
}

.banner {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 50%;
  width: 325px;
  object-fit: cover;
  z-index: 0;
}
</style>
