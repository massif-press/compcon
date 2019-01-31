<template>
  <div v-b-popover.hover="hover" placement="bottom">
    <span class="small-label">{{label}}</span>
    <br>
      <svg class="inline" :width="pip_width * 2" :height="pip_height" :style="`margin-right: -${pip_width}px;`">
        <polygon class="inline" :points="`0 0, ${pip_width * 2} 0, ${pip_width } ${pip_height}, 0 ${pip_height}`" :stroke="borders[pips[0] > 0 ? 0 : borders.length - 1]" :fill="fills[pips[0] > 0 ? 0 : borders.length - 1]"/>
      </svg>
    <div class="inline">
      <div v-for="(p, index) in pips" :key="index" class="inline">
        <div v-if="p > 0" class="inline">
          <div v-for="n in (endcap ? p - 1 : p)" :key="n" class="inline">
            <svg :width="pip_width * 2" :height="pip_height" :style="`margin-right: -${pip_width/1.5}px;`">
              <polygon class="inline" :points="`${pip_width * 2} 0, ${pip_width} 0, 0 ${pip_height}, ${pip_width} ${pip_height}`" :stroke="borders[index]" :fill="fills[index]"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
      <svg v-if="endcap" class="inline" :width="pip_width * 2" :height="pip_height" :style="`margin-right: -${pip_width}px;`">
        <polygon class="inline" :points="`${pip_width * 2} 0, ${pip_width} 0, 0 ${pip_height}, ${pip_width * 2} ${pip_height}`" :stroke="borders[borders.length - 1]" :fill="fills[fills.length - 1]"/>
      </svg>
    </div>
</template>

<script>
  export default {
    name: 'pip-bar',
    props: [
      'hover',
      'label',
      'pip_width',
      'pip_height',
      'pips',
      'fills',
      'borders',
      'endcap'
    ]
  }
</script>

<style>
  .small-label {
    font-size: 10px;
    position: relative;
    bottom: -5px;
    left: 5px;
  }
</style>

<style scoped>
  .inline {
    display:inline!important
  }
  </style>
