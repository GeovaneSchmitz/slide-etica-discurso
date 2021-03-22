<template lang="pug">
  div(v-html='svg')
</template>

<script>
import svgs from '@/svgs.json'

export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      svg: ''
    }
  },
  mounted() {
    /* fetch(this.src, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // no-referrer, *client
    }).then((response) => {
      response.text().then((svg) => {
        this.svg = svg
        console.log(this.src, svg)
      })
      if (response.status !== 200) {
        throw new Error(`STATUSCODE_${response.status}`)
      }
    }) */
    this.svg = svgs[this.src]
  },
  methods: {}
}
</script>

