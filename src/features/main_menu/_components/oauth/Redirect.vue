<template>
  <div class="my-12 heading h3">Linking account...</div>
</template>

<script>
export default {
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const code = params.get('code');
    const access_token = hash.split('=')[1];

    if (code) {
      window.opener.postMessage({ type: 'oauth-code', code }, window.location.origin);
      window.close();
    } else if (access_token) {
      window.opener.postMessage({ type: 'access_token', access_token }, window.location.origin);
      window.close();
    }
  },
};
</script>
