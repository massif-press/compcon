<template>
  <div>
    <div
      style="
        position: absolute;
        z-index: 2;
        height: 38px;
        left: 0;
        right: 0;
        top: 0;
        bottom: 20px;
        background-color: rgb(var(--v-theme-primary));
        text-align: right;
      "
    >
      <div class="pa-1">
        <update-checker @mouseenter="$emit('logupdate')" />
        <div
          style="
            display: inline-block;
            position: relative;
            z-index: 999 !important;
          "
          class="pr-1 pl-2"
        >
          <v-btn
            target="_blank"
            href="https://github.com/massif-press/compcon/blob/master/CHANGELOG.md"
            color="white"
            variant="outlined"
            size="small"
            @mouseenter="$emit('logupdate')"
          >
            View Changelog
          </v-btn>
        </div>
      </div>
    </div>
    <div
      class="clipped pl-4 pt-2"
      style="position: absolute; height: 80px; left: 0; top: 0"
    >
      <div id="title">COMP/CON</div>
      <div id="subtitle">v.{{ $appVersion }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import UpdateChecker from './UpdateChecker.vue';

export default {
  name: 'cc:banner',
  components: { UpdateChecker },
};
</script>

<style scoped>
.clipped {
  position: relative;
  background-color: rgb(var(--v-theme-primary));
  width: 70%;
  clip-path: polygon(
    100% 0,
    100% calc(100% - 50px),
    calc(100% - 50px) 100%,
    0 100%,
    0 0
  );
  -webkit-clip-path: polygon(
    100% 0,
    100% calc(100% - 50px),
    calc(100% - 50px) 100%,
    0 100%,
    0 0
  );
  opacity: 1;
  z-index: 2;
}

#title {
  font-family: 'Helvetica Bold', sans-serif;
  color: white;
  font-weight: 900;
  letter-spacing: 5px;
  text-transform: uppercase;
  font-size: 50pt;
  line-height: 35pt;
}

#subtitle {
  font-family: 'Consolas', monospace;
  color: white;
  font-size: 12pt;
}
</style>
