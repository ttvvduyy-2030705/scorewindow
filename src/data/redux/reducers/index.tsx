import {combineReducers} from 'redux';

import game from './game';
import history from './history';
import UI from './loading';

const rootReducer = combineReducers({
  game,
  history,
  UI,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
