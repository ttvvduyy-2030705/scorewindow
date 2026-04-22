import{put,takeLatest}from'redux-saga/effects';import{configsActions,configsTypes}from'../actions/configs';
const retrieveStreamKey=function*({onError}:ReturnType<any>){onError?.();yield put(configsActions.retrieveStreamKeyError())};
const watcher=function*(){yield takeLatest(configsTypes.RETRIEVE_STREAM_KEY,retrieveStreamKey)};export default watcher();
