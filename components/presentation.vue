<template lang="pug">
  .presentation-wrapper
    .presentation.presentation-screen(:data-breakpoint="currentBreakpoint.index", ref='presentation')
      app-background(:current-breakpoint="currentBreakpoint")
      div.slide-wrapper
        transition(name="opacity")
          app-text-typing.title(:text="currentBreakpoint.title" v-show="currentBreakpoint.title" :speed="50")
        transition(name="opacity")
          app-text-typing.subtitle(:text="currentBreakpoint.subtitle" v-show="currentBreakpoint.title" :speed="25")
        transition(name="opacity")
          div.content-wrapper(v-show="currentBreakpoint.title")
            app-slide-cover.slide(:current-breakpoint="currentBreakpoint")
            app-topics.topics(v-show="currentBreakpoint.title" :topics="currentBreakpoint.topics||[]")
</template>

<script>
import appBackground from '@/components/background.vue'
import appSlideCover from '@/components/slides/cover.vue'
import appTextTyping from '@/components/text-typing.vue'
import appInlineSvg from '~/components/inline-svg.vue'
import appTopics from '~/components/topics.vue'
export default {
  components: {
    appBackground,
    appInlineSvg,
    appTextTyping,
    appSlideCover,
    appTopics,
  },
  props: {
    currentBreakpoint: {
      type: Object,
      default() {
        return {}
      },
    },
    print: {
      type: Boolean,
      default: false,
    },
    printBreakpoints: {
      type: Array,
      default() {
        return []
      },
    },
  },
  watch: {
    currentBreakpoint(value) {
      if (value.index === 'cover') {
        this.subtitle = ''
      }
    },
  },
  data() {
    return { subtitle: '' }
  },
  mounted() {},
  methods: {},
}
</script>

<style module lang="scss">
.svg-cover > svg {
  transform: translate(5em, 0);
  width: 100% !important;
  transition: all 0.5s;
  height: 100% !important;
  z-index: 1;
  position: absolute;
  opacity: 0;
}
.input {
  z-index: 10;
}
.topics {
  width: 100%;
  flex-grow: 10;
  position: absolute;
  font-size: 2em;
  color: #fff;
  font-weight: 400;
  padding: 2em 0 0 0;
}

.opacity {
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(1em);
  }
}

.slide {
  width: 92em;
  position: absolute;
  flex-grow: 10;
  height: 100%;
}
.slide-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  padding: 4em;
  height: #{(100 / 16 * 9) - 8}em;
}
.content-wrapper {
  width: 92em;
  transition: all 400ms;
  flex-grow: 10;
  position: relative;
}
.title {
  transition: all 400ms;
  display: block;
  font-weight: 800;
  font-size: 4em;
  line-height: 1;
  color: #ffbc25;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.subtitle {
  transition: all 400ms;
  display: block;
  color: #fff;
  font-size: 2em;
}
.presentation {
  z-index: 0;
  user-select: none;
  overflow: hidden;
  display: none;
}

@media screen {
  .presentation-screen {
    display: block;
  }
  .presentation-wrapper {
    overflow: hidden;
    background-color: #000;
    width: 100vw;
    height: 100vh;
    position: absolute;
    display: flex;
    justify-items: center;
    align-content: center;
    align-items: center;
    z-index: 0;
  }
  .presentation {
    height: 56.25vw;
    width: 100vw;
    font-size: 1vw;
    position: absolute;
  }
}
@media screen and (min-aspect-ratio: 16/9) {
  .presentation-wrapper {
    flex-direction: column;
  }
  .presentation {
    height: 100vh;
    width: 177.77777777vh;
    font-size: 1.7777777777vh;
  }
}
@media print {
  .presentation {
    width: 1920px !important;
    height: 1080px !important;
    font-size: 19.2px !important;
  }
  .presentation-print {
    display: block;
  }
}
</style>
