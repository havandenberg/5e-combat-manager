import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';

import auth from './auth';
import characters from './character';
import combats from './combat';
import folders from './folder';

export default combineReducers({
  routing: routerReducer,
  auth,
  characters,
  combats,
  folders
});
