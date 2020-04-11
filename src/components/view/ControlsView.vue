<template>
  <div>
    <button @click="onRestartClick">RESTART</button>
    <button :style="styleObjectCheat" @click="onSaveClick">SAVE</button>
    <button :style="styleObjectCheat" @click="onLoadClick">LOAD</button>
    <button :style="styleObjectCheat" @click="onSkipClick">SKIP</button>
    <button :style="styleObjectCheat" @click="onBackClick">BACK</button>
    <button :style="styleObjectCheat" v-show="isCheatPurchased" @click="onEpisodeClick">EPISODE</button>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // Hide cheat button in release
      styleObjectCheat: {
        display: this.$debug ? 'auto' : 'none'
      },
      // Can buy this cheat to enable button
      isCheatPurchased: false
    }
  },
  methods: {
    onRestartClick () {
      console.log('RESTART')
      this.$emit('restartGame')
    },

    onSaveClick () {
      console.log('saveGame')
      this.$emit('saveGame')
    },

    onLoadClick () {
      console.log('loadGame')
      this.$emit('loadGame')
    },

    onBackClick () {
      console.log('cheatBack')
      this.$emit('cheatBack')
    },

    onSkipClick () {
      console.log('cheatSkip')
      this.$emit('cheatSkip')
    },

    onEpisodeClick () {
      console.log('cheatEpisode')
      this.$emit('cheatEpisode')
    },

    enablePurchasedCheats () {
      console.log('enablePurchasedCheats')
      this.isCheatPurchased = true
    }
  }
}
</script>

<style scoped>
</style>
