<template lang="pug">
div.wrapper
  ul.list(:class='{"list-disable": currentTopics !== 1}')
    li.topic(v-for="(topic, index) in topics1" :key="topic")
      span(v-html="topic")
  ul.list.list-2(:class='{"list-disable": currentTopics !== 2}')
    li.topic(v-for="(topic, index) in topics2" :key="topic")
      span(v-html="topic")
</template>
<script>
import appTextTyping from '@/components/text-typing.vue'

export default {
  components: { appTextTyping },
  props: {
    topics: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      setTimeoutId: null,
      currentTopics: 1,
      topics1: [],
      topics2: [],
    }
  },
  watch: {
    topics(value) {
      if (this.setTimeoutId) clearTimeout(this.setTimeoutId)
      if (this.currentTopics === 1) {
        this.topics2 = value
        this.currentTopics = 2
        this.setTimeoutId =
          (() => {
            this.topics1 = []
          },
          400)
      } else {
        this.currentTopics = 1
        this.topics1 = value
        this.setTimeoutId =
          (() => {
            this.topics2 = []
          },
          400)
      }
    },
  },

  methods: {},
}
</script>

<style module lang="scss">
.wrapper {
  position: relative;
}

.list {
  list-style: none;
  padding: 0;
  position: absolute;
  margin: 0;
  transition: all 400ms;
  display: flex;
  flex-direction: column;
  &-disable {
    opacity: 0;
    transform: translateX(1em);
  }
}

.topic {
  opacity: 1;
  display: inline-block;
  transition: all 400ms;
  position: relative;
  margin: 0;
  vertical-align: middle;
  padding-left: 1em;
  text-indent: -1em;
}
.topic::before {
  content: '• ';
  font-size: 2em;
  vertical-align: middle;
  color: #ffbc25; /* or whatever color you prefer */
}
</style>
