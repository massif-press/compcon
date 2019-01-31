<template>
<div v-b-popover.hover="hover" :placement="'righttop'">
  <span class="small-label">{{label}}</span>
    <div class="skew">
      <div v-for="(p, index) in pips" :key="index" style="display:inline!important">
        <div v-for="n in p" :key="n" style="display:inline!important; padding:1px">
          <svg :width="pip_width" :height="pip_height" >
            <rect x="0" y="0" :width="pip_width" :height="pip_height" :fill="colors[index]"/>
          </svg>
        </div>
      </div>
    </div>
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
      'colors'
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
  .skew {
    transform: skew(-25deg);
  }
</style>
