<template>
  <i18n-t
    v-bind="{ keypath }"
    tag="span"
    scope="global"
  >
    <template #https>
      <code>{{ HTTPS }}</code>
    </template>
    <template
      v-for="(link, name) in LINKS"
      :key="name"
      #[name]
    >
      <a
        :href="link.href"
        target="_blank"
        rel="noopener"
      >
        {{ link.label }}
      </a>
    </template>
  </i18n-t>
</template>

<script setup lang="ts">
  defineProps<{ keypath: string }>()

  const HTTPS = 'https://'

  const LINKS = {
    itchSupport: { href: 'mailto:support@itch.io', label: 'support@itch.io' },
    compconEmail: { href: 'mailto:compcon@massifpress.com', label: 'compcon@massifpress.com' },
    darkHorseSupport: {
      href: 'https://www.darkhorse.com/help/contact/',
      label: 'https://www.darkhorse.com/help/contact/',
    },
    massifShop: { href: 'https://massifpress.com/shop', label: 'https://massifpress.com/shop' },
    permalink: { href: 'https://compcon.app/core-book-lcp', label: 'compcon.app/core-book-lcp' },
  }
</script>
