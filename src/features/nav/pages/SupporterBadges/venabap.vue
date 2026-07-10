<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <v-card variant="tonal"
    class="rounded-ts-xl rounded-be-xl brand-styles">
    <v-card-text class="pa-1"
      style="position: relative; z-index: 1">
      <v-row align="center">
        <v-col cols="auto">
          <v-avatar size="100px">
            <v-img src="/img/misc/supporters/vena_av.png"
              alt="venabap" />
          </v-avatar>
        </v-col>
        <v-col>
          <div class="heading h2 mb-1"
            style="color: #f2f1fd;  text-shadow: 2px 2px 2px #23273b;">
            Vena
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
a,
a:visited {
  text-decoration: none !important;
  color: inherit;
}

.brand-styles {
  background: #4EC086;
  border: 5px solid #1b5661;
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
