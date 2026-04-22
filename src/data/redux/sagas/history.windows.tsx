import{put,takeLatest}from'redux-saga/effects';import{historyActions,historyTypes}from'../actions/history';
const deleteHistory=function*(){yield put(historyActions.deleteHistorySuccess())};
const watcher=function*(){yield takeLatest(historyTypes.DELETE_HISTORY,deleteHistory)};export default watcher();
