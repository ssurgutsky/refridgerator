<template>
  <div>
    <p style="white-space: pre-line">{{txtQuestion}}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      txtQuestion: ''
    }
  },
  methods: {
    setQuestion (txt) {
      this.txtQuestion = txt
    },

    clearQuestion () {
      this.txtQuestion = ''
    }
  }
}
</script>

<style scoped>
  div {
    background-color: #000000;
    color: #ffffff;
  }
</style>
