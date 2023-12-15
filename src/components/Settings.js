/* eslint no-eval: 0 */

export default {
  // Increase this on every update to reload assets for new on startup
  GAME_VERSION: 40,
  // Release = true
  CACHE_ENABLED: true,

  GAME_VERSION_VAR_NAME: 'game_version',
  GAME_UPGRADE_POINT: 'GAME_UPGRADEPOINT',
  GAME_SAVE_POINT: 'GAME_SAVEPOINT',
  // Goto this mark if not found player's one on LOAD button pressing
  DEFAULT_LOAD_MARK_NAME: 'START',
  // Just a name of Index DB for this game
  INDEXEDDB_STORE_NAME: 'store_fridge',
  // Google Play IAP
  GP_PRODUCT1_NAME: 'com.skystairgames.fridge.coin1',
  GP_PRODUCT2_NAME: 'com.skystairgames.fridge.episodes',
  // You can enable some buttons by default in the regular game
  ENABLE_SAVE_BUTTON: true,
  ENABLE_LOAD_BUTTON: true,
  ENABLE_SKIP_BUTTON: true,
  ENABLE_EPISODES_BUTTON: false,
  ENABLE_BACK_BUTTON: false,
  ENABLE_DONATE_BUTTON: true,

  ENABLE_SPEECH: false // window.speechSynthesis !== undefined
}
