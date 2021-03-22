<template lang="pug">
  .background
    .border(:class="{'border-show':currentBreakpoint.index !== 'blank' && currentBreakpoint.index !== '7', 'border-full': currentBreakpoint.index === '7'}")
      .border-image
      .border-text
        .title
          |Principais Ideias
        ul
          li
            |Teoria da ação comunicativa;
          li
            |Ética do discurso.
        
</template>

<script>
export default {
  props: { currentBreakpoint: { type: Object, required: true } },
}
</script>

<style module lang="scss">
.background {
  position: absolute;
  width: 100em;
  height: 56.25em;
  z-index: -1;
  overflow: hidden;
  background-color: #4e3388;
}
.title {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 4em;
  font-weight: 800;
}
.border li {
  font-size: 3em;
  margin-bottom: 1em;
}
.border {
  transition: all 1s;
  position: relative;
  background-color: #ffbc25;
  transform-origin: center left;
  transform: rotate(90deg);
  width: 100em;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &-image {
    margin-top: -5em;
    opacity: 0;
    transition: all 1s cubic-bezier(1, 0, 0.54, 0.99);
    background-size: contain;
    background-repeat: no-repeat;
    width: 20em;
    height: 20em;
    background-image: url('../assets/images/light-bulb.svg');
  }
  &-full {
    background-color: #e9a200;
    width: 100em;
    height: 100%;
    transform: rotate(0deg);
  }
  &-text {
    transition: all 1s cubic-bezier(1, 0, 0.54, 0.99);
    opacity: 0;
    font-weight: 300;
    color: #4e3388;
  }
  &-full &-text,
  &-full &-image {
    opacity: 1;
  }
  &-show {
    height: 2em;
    transform: rotate(90deg) translate(-1em, -1em);
  }
}
</style>
