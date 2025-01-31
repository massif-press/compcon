<template>
  <div>
    <div
      class="bg-primary"
      style="
        position: absolute;
        z-index: 2;
        height: 38px;
        left: 0;
        right: 0;
        top: 0;
        bottom: 20px;
        text-align: right;
      ">
      <div class="pa-1">
        <div style="display: inline-block; position: relative" class="mr-1">
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <cc-button
                v-bind="props"
                size="small"
                variant="text"
                style="font-family: 'Consolas', monospace"
                target="_blank"
                color="white"
                href="https://github.com/massif-press/compcon/blob/master/CHANGELOG.md"
                @mouseenter="$emit('logupdate')">
                v.{{ version }}
              </cc-button>
            </template>
            <span>View changelog</span>
          </v-tooltip>
        </div>
      </div>
    </div>
    <div class="clipped pl-4 pt-3" style="position: absolute; height: 74px; left: 0; top: 0">
      <div id="title">COMP/CON</div>
    </div>
  </div>
</template>

<script lang="ts">
import * as p from '../../../../package.json';

export default {
  name: 'cc:banner',
  computed: {
    version() {
      return p.version;
    },
  },
};
</script>

<style scoped>
.clipped {
  position: relative;
  background-color: rgb(var(--v-theme-primary));
  width: 70%;
  clip-path: polygon(100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 0);
  -webkit-clip-path: polygon(100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%, 0 0);
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
