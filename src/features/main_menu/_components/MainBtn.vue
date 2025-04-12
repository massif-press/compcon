<template>
  <v-col class="col-container" cols="12">
    <div style="height: 70px">
      <div
        class="btn-main"
        @mouseenter="$emit('hover')"
        @mouseover="mouseOver = true"
        @mouseleave="mouseOver = false"
        @focusin="mouseOver = true"
        @focusout="mouseOver = false"
        @click="doAction"
        @keydown.enter="doAction"
        tabindex="0">
        <div class="unskew heading">
          <v-icon size="50" class="ml-n4 mt-n3">{{ icon }}</v-icon>
          <slot />
        </div>
      </div>
    </div>
    <div
      class="d-inline text-overline help-text"
      style="position: absolute; left: 150px; width: fit-content !important">
      > {{ help }}
    </div>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'main-btn',
  props: {
    to: {
      type: String,
      required: false,
      default: '',
    },
    help: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
    icon: {
      type: String,
      default: 'cc:pilot',
    },
  },
  data: () => ({
    mouseOver: false,
  }),
  methods: {
    doAction() {
      if (this.to) {
        this.$router.push(this.to);
      } else {
        this.$emit('clicked');
      }
    },
  },
};
</script>

<style scoped>
.unskew {
  transform: skew(0.65rad) !important;
  position: absolute;
  left: 50px;
  color: #fff;
  font-size: 28pt;
  margin-top: 8px;
}

.unskew::before {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 5px;
  background-color: rgb(var(--v-theme-background));
  transform-origin: bottom right;
  transform: scaleX(0);
  transition: transform 0.45s ease;
}

.btn-main:not(.disabled):hover > .unskew::before {
  transform-origin: bottom left;
  transform: scaleX(1);
}

.btn-main {
  position: absolute;
  cursor: pointer;
  height: 70px;
  width: 620px;
  left: -30px;
  transform: skew(-0.65rad);
  background: rgb(var(--v-theme-primary));
  z-index: 5;
  transition: all ease-in-out 0.45s;
  outline: none;
}
.btn-main:not(.disabled):hover,
.btn-main:not(.disabled):focus {
  background-color: rgb(var(--v-theme-active));
  transition: all ease-in-out 0.45s;
}
.btn-main::after {
  content: ' ';
  position: absolute;
  left: 590px;
  height: 71px;
  width: 12px;
  background: rgb(var(--v-theme-background));
  transition: all ease-in-out 0.45s;
  z-index: 4;
}
.btn-main:not(.disabled):hover::after,
.btn-main:not(.disabled):focus::after {
  left: 625px;
  background: rgb(var(--v-theme-active));
  transition: all ease-in-out 0.45s;
}
.btn-main::before {
  content: ' ';
  position: absolute;
  left: 590px;
  height: 71px;
  width: 8px;
  background: rgb(var(--v-theme-background));
  transition: all ease-in-out 0.45s;
  z-index: 4;
}
.btn-main:not(.disabled):hover::before,
.btn-main:not(.disabled):focus::before {
  left: 650px;
  background: rgb(var(--v-theme-active));
  transition: all ease-in-out 0.45s;
}

.btn-main.disabled,
.btn-main.disabled .unskew {
  cursor: default;
}

.help-text {
  opacity: 0.5;
  color: rgb(var(--v-theme-text));
  transition: all ease-in-out 0.45s;
  margin-left: -125px;
}

.col-container:hover .help-text {
  opacity: 1;
  color: rgb(var(--v-theme-accent));
  font-weight: bolder;
}
</style>
