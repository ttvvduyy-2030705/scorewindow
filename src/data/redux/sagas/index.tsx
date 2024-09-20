import {all} from 'redux-saga/effects';

import game from './game';
import history from './history';

const rootSaga = function* () {
  yield all([game, history]);
};

export type SagaResponse<T> = {
  success: boolean;
  data: T;
  code: number;
  message: string;
  status: number;
};

export default rootSaga;
