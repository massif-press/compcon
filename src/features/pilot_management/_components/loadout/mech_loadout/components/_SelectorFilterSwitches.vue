<template>
  <cc-switch
    :model-value="unlicensed"
    :label="mobile && $t('pm.loadout.showUnlicensed')"
    color="error"
    :tooltip="
      !mobile && unlicensed ? $t('pm.loadout.unlicensedShown') : $t('pm.loadout.unlicensedHidden')
    "
    :prepend-icon="mobile ? undefined : 'cc:system'"
    on-icon="mdi-lock-open"
    off-icon="mdi-lock"
    @update:model-value="$emit('update:unlicensed', $event)"
  />
  <br />
  <cc-switch
    :model-value="overSp"
    :label="mobile && $t('pm.loadout.showExceedsSp')"
    color="error"
    :tooltip="
      !mobile && overSp
        ? $t('pm.loadout.exceedsSpShown')
        : $t('pm.loadout.exceedsSpHidden')
    "
    :prepend-icon="mobile ? undefined : 'cc:system_point'"
    on-icon="mdi-lock-open"
    off-icon="mdi-lock"
    @update:model-value="$emit('update:overSp', $event)"
  />
  <slot />
</template>

<script setup lang="ts">
  defineProps<{
    unlicensed: boolean
    overSp: boolean
    mobile: boolean
  }>()

  defineEmits<{
    'update:unlicensed': [val: boolean]
    'update:overSp': [val: boolean]
  }>()
</script>
