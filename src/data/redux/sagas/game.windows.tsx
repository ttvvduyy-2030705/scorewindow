import{put,takeLatest}from'redux-saga/effects';import{gameActions,gameTypes}from'../actions/game';
const updateGameSettings=function*({payload}:ReturnType<any>){yield put(gameActions.updateGameSettingsSuccess(payload))};
const endGame=function*(){yield put(gameActions.endGameSuccess());yield put(gameActions.updateGameSettingsSuccess(undefined))};
const watcher=function*(){yield takeLatest(gameTypes.UPDATE_GAME_SETTINGS,updateGameSettings);yield takeLatest(gameTypes.END_GAME,endGame)};export default watcher();
