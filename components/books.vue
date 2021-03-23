<template lang="pug">
  div.wrapper(:class="{'show': show}")
    img.image(src="../assets/images/book4.jpg")
    img.image(src="../assets/images/book3.jpg")
    img.image(src="../assets/images/book2.jpg")
    img.image(src="../assets/images/book1.jpg")

</template>

<script>
import appTextTyping from '@/components/text-typing.vue'
export default {
  components: {
    appTextTyping,
  },
  props: { show: { type: Boolean, required: true } },
  data() {
    return {}
  },
}
</script>

<style module lang="scss">
.wrapper {
  position: absolute;
  transition: 1s all;
  opacity: 0;
  width: 20em;
}
.image {
  position: absolute;
  transition: 15s all cubic-bezier(.08,.72,.22,1.04);
  width: 100%;
  box-shadow: 0 0 2em 1em rgba(0, 0, 0, 0.1);
  transform: translate(-1em, 1em) skewY(0);
}
.show .image:nth-child(1) {
  transform: translate(8em, -8em) skewY(8deg);
}
.show .image:nth-child(2) {
  transform: translate(4em, -4em) skewY(8deg);
}
.show .image:nth-child(3) {
  transform: translate(0, 0) skewY(8deg);
}
.show .image:nth-child(4) {
  transform: translate(-4em, 4em) skewY(8deg);
}

.show {
  opacity: 1;
}
</style>
