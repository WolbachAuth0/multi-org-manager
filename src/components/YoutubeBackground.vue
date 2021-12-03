<template>
  <div class="video-container">
    <iframe :src="src"></iframe>
  </div>
</template>

<script>
const hackerVids = {
  'Matrix Rain': 'rpWrtXyEAN0',
  'Blue Code Glitch': '5-JpEGxWvKU',
  'Numbers': 'QEvpXgvpWL0',
  'Hackers': 'CPXNxEdI3KQ',
  'Green Code': 'D_OPcPXlI7g'
}

export default {
  name: 'YoutubeBackground',
  props: {
    youtubeID: { type: String, default: hackerVids['Blue Code Glitch'] }
  },
  data() {
    return {}
  },
  computed: {
    src() {
      return `https://www.youtube.com/embed/${this.youtubeID}?start=0controls=0&autoplay=1&mute=1&playlist=${this.youtubeID}&loop=1`
    }
  }
}
</script>

<style scoped>
  @media (min-aspect-ratio: 16/9) {
    .video-container iframe {
      /* height = 100 * (9 / 16) = 56.25 */
      height: 56.25vw;
    }
  }
      
  @media (max-aspect-ratio: 16/9) {
    .video-container iframe {
      /* width = 100 / (9 / 16) = 177.777777 */
      width: 177.78vh;
    }
  }

  .video-container{
    object-fit: cover;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: black;
  }
      
  iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 100vh;
    transform: translate(-50%, -50%);
  }
</style>