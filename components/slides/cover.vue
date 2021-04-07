<template lang="pug">
transition(name="message")
  div.cover
    div
      app-text-typing.course(:text="course")
    transition-group.authors(name="message" tag="div")
      .message(v-for="author in currentAuthors" :key="author")
        .message-corner
        span
          |{{author}}
    transition-group.chat(name="message" tag ="div" :class="{'chat-full': currentBreakpoint.index ==='cover'}")
      .chat-message-wrapper(:style="{'width': message.width + 'em', height: message.height + 'em', 'margin-bottom': message.noSpace ? '0.1em':'0.5em'}" :class="{'chat-message-is-red': message.color ==='red', 'chat-message-is-green': message.color ==='green','chat-message-is-left': message.position ==='left', 'chat-message-is-right': message.position ==='right'}" v-for="message in currentMessages" :key="message.id")
        .chat-message-corner
        .chat-message
    transition(name="message")
</template>

<script>
import appTextTyping from '@/components/text-typing.vue'
export default {
  components: {
    appTextTyping,
  },
  props: { currentBreakpoint: { type: Object, required: true } },
  data() {
    return {
      currentMessages: [],
      messages: [
        {
          id: 0,
          color: 'red',
          position: 'left',
          width: 5,
          height: 1,
          timeout: 200,
        },
        {
          id: 1,
          color: 'green',
          position: 'right',
          width: 4,
          height: 1,
          timeout: 220,
        },
        {
          id: 2,
          color: 'green',
          position: 'left',
          width: 5,
          height: 1,
          timeout: 250,
        },
        {
          id: 3,
          color: 'red',
          position: 'right',
          width: 7,
          height: 2,
          timeout: 150,
        },
        {
          id: 4,
          color: 'green',
          position: 'left',
          width: 6,
          height: 1,
          noSpace: true,
          timeout: 130,
        },
        {
          id: 5,
          color: 'green',
          position: 'left',
          width: 3,
          height: 1,
          timeout: 160,
        },
        {
          id: 6,
          color: 'red',
          position: 'right',
          width: 4,
          height: 1,
          timeout: 230,
        },
        {
          id: 7,
          color: 'red',
          position: 'left',
          width: 3,
          height: 1,
          timeout: 110,
          noSpace: true,
        },
        {
          id: 8,
          color: 'red',
          position: 'left',
          width: 7,
          height: 2,
          timeout: 120,
        },
        {
          id: 9,
          color: 'green',
          position: 'right',
          width: 4.5,
          height: 1,
          timeout: 100,
        },
      ],
      course: '',
      currentAuthors: [],
      intervalChat: null,
      intervalNames: null,
      authors: [
        'Camila Simones',
        'Geovane Martins Schmitz',
        'Pamela Fialho Silva Lopes de Oliveira',
        'Rebeca Mallmann de los Campos',
        'Valter Rogério da Silva Junior ',
      ],
    }
  },
  watch: {
    currentBreakpoint(value) {
      if (value.index === 'cover') {
        this.course = ''
        this.currentAuthors = []
        this.currentMessages = []
        this.startChat()
        this.startSubtitle()
        this.startNames()
      } else {
        this.course = ''
        this.currentAuthors = []
        if (value.index === '3' || value.index === '7') {
          this.currentMessages = []
        } else if (value.index === '6') {
          this.currentMessages = this.messages.slice(-1)
        } else {
          this.currentMessages = this.messages.slice(-2)
        }
        if (this.intervalNames) {
          clearTimeout(this.intervalNames)
          this.intervalNames = null
        }
        if (this.intervalChat) {
          clearTimeout(this.intervalChat)
          this.intervalChat = null
        }
      }
    },
  },
  mounted() {
    this.startChat()
  },
  methods: {
    startSubtitle() {
      if (this.currentBreakpoint.index !== 'cover') return
      this.course = 'Turmas 722 e 723'
    },
    startNames() {
      if (this.currentBreakpoint.index !== 'cover') return
      if (this.intervalNames) return
      this.intervalNames = setTimeout(() => {
        if (this.authors.length > this.currentAuthors.length) {
          this.currentAuthors.push(this.authors[this.currentAuthors.length])
          this.intervalNames = null
          this.startNames()
        } else {
          this.intervalNames = null
        }
      }, 200)
    },
    startChat() {
      if (this.currentBreakpoint.index !== 'cover') return
      if (
        this.intervalChat ||
        this.currentMessages.length >= this.messages.length
      )
        return
      this.intervalChat = setTimeout(() => {
        if (this.messages.length > this.currentMessages.length) {
          this.currentMessages.push(this.messages[this.currentMessages.length])
          this.intervalChat = null
          this.startChat()
        } else {
          this.intervalChat = null
        }
      }, this.messages[this.currentMessages.length].timeout)
    },
  },
}
</script>

<style module lang="scss">
.cover {
  display: flex;
  height: max-content;
  flex-direction: column;
  justify-content: space-between;
}

.chat {
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: calc(100% + 3em);
  width: 25em;
  right: 0;
  position: absolute;
  transition: all 400ms;
  &-full {
    transform: translateY(-3em);
  }
  &-message {
    padding: 0.3em 1em;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    border-radius: 0.25em;
    &-wrapper {
      transition: all 100ms;
      font-size: 2.4em;
      display: block;
      position: relative;
    }
    &-corner {
      z-index: -1;
      position: absolute;
      width: 1em;
      height: 0.9em;
      top: 0.025em;
    }

    &-is-left &-corner {
      left: 0.25em;
      transform: skewX(45deg);
    }

    &-is-right &-corner {
      right: 0.25em;
      transform: skewX(-45deg);
    }
    &-is-right.chat-message-wrapper {
      align-self: flex-end;
    }
    &-is-red & {
      background-color: #874e4c;
    }
    &-is-red .chat-message-corner {
      background-color: #2e1718;
    }
    &-is-green & {
      background-color: #874e4c;
    }

    &-is-green .chat-message-corner {
      background-color: #2e1718;
    }
  }
}

.course {
  display: block;
  color: var(--text);
  font-size: 1.5em;
}

.message {
  position: relative;
  display: block;
  margin-bottom: 0.3em;
  background-color: var(--message);
  border-radius: 0 0.25em 0.25em 0.35em;
  padding: 0.3em 1em;
  color: #fff;
  width: max-content;
  font-size: 1.3em;
  transition: all 500ms;
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(1em);
  }

  &-corner {
    z-index: -1;
    position: absolute;
    background-color: var(--message);
    width: 1em;
    height: 1em;
    left: 0;
    top: 0;
    transform: skewX(45deg);
  }
}
</style>
