import {call, put, takeLatest} from 'redux-saga/effects';
import {historyActions, historyTypes} from '../actions/history';
import {BSON} from 'realm';
import RNFS from 'react-native-fs';
import {GameSettings} from 'types/settings';
import {DeleteGame} from 'data/realm/RQL/game';

const deleteHistory = function* ({payload}: ReturnType<any>) {
  const {realm, item} = payload as {
    realm: Realm;
    item: GameSettings & {
      id: BSON.ObjectId;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  if (item.webcamFolderName) {
    const directoryPath = `${RNFS.DownloadDirectoryPath}/${item.webcamFolderName}`;
    const directoryExist: boolean = yield call(RNFS.exists, directoryPath);

    if (directoryExist) {
      yield call(RNFS.unlink, directoryPath);
    }
  }

  yield call(DeleteGame, realm, item.id);

  yield put(historyActions.deleteHistorySuccess());
};

const watcher = function* () {
  yield takeLatest(historyTypes.DELETE_HISTORY, deleteHistory);
};

export default watcher();
