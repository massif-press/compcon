<template>
  <div style="min-height: 20vh; width: 700px; margin: auto" class="py-4">
    <div class="heading h2 mb-2 text-center pb-4">{{ $t('ui.missing.noNpcData') }}</div>

    <i18n-t keypath="ui.missing.npcDataHelp" tag="span" scope="global">
      <template #link><a href="https://massif-press.itch.io/corebook-pdf" target="_blank">{{ $t('ui.missing.coreBookLink') }}</a></template>
    </i18n-t>
    <br />
    <br />
    {{ $t('ui.missing.gmHelp1') }}
    <br />
    <br />
    <i18n-t keypath="ui.missing.gmHelp2" tag="span" scope="global">
      <template #email><a href="mailto:massifpress@gmail.com">massifpress@gmail.com</a></template>
    </i18n-t>
  </div>
</template>
