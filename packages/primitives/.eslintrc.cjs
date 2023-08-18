require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  extends: [
    'plugin:vue/recommended', // Use this if you are using Vue.js 2.x.
    '@vue/eslint-config-typescript'
  ],
  rules: {
    "vue/multi-word-component-names": 0,
  }
}
