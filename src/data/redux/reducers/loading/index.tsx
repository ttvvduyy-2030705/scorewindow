import {combineReducers} from 'redux';

import game from './game';
import history from './history';

//Loading reducer
const rootUILoading = combineReducers({game, history});

export default rootUILoading;
