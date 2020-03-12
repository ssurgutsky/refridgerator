<template>
  <div style="'display': 'none'">
    <iframe src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9D%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0&targets-hint=%D0%9D%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D0%B5&default-sum=50&button-text=11&hint=&successURL=&quickpay=shop&account=41001220674141" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
export default {
  name: 'YandexMoneyPlayer',
  data () {
    return {
      player: null
    }
  },
  mounted () {
  },
  methods: {
    initialize () {

    },

    show (name) {
      this.styleObject.display = 'flex'
    },

    hide () {
      this.styleObject.display = 'none'
    }
  }
}
</script>

<style scoped>
</style>
