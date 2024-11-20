<template>
  <div class="my-12 heading h3">Authenticating...</div>
</template>

<script>
export default {
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      window.opener.postMessage({ type: 'patreon-code', code }, window.location.origin);
      window.close();
    }
  },
};
</script>
