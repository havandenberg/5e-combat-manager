import {routerReducer} from 'react-router-redux';
import {combineReducers} from 'redux';

import auth from './auth';
import register from './register';

export default combineReducers({
  routing: routerReducer,
  auth,
  register
});
