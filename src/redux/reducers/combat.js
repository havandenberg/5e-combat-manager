import Immutable from 'immutable';
import {routerActions} from 'react-router-redux';
import {firebaseRef} from 'utils/firebase';

const initialState = Immutable.List();

export const ADD_COMBAT = 'ADD_COMBAT';
export const UPDATE_COMBAT = 'UPDATE_COMBAT';
export const DELETE_COMBAT = 'DELETE_COMBAT';
export const ADD_COMBATS = 'ADD_COMBATS';
export const CLEAR = 'CLEAR';

export default function reducer(combats = initialState, action = {}) {
  switch (action.type) {
  case ADD_COMBAT:
    return combats.push(action.combat);
  case UPDATE_COMBAT:
    return combats.map((combat) => {
      if (combat.id === action.id) {
        return {
          ...combat,
          ...action.updates
        };
      }
      return combat;
    });
  case DELETE_COMBAT:
    return combats.filterNot((combat) => {
      return combat.id === action.id;
    });
  case ADD_COMBATS:
    return combats.push(...action.combats);
  case CLEAR:
    return initialState;
  default:
    return combats;
  }
}

export function addCombat(combat) {
  return {
    type: ADD_COMBAT,
    combat
  };
}

export function updateCombat(id, updates) {
  return {
    type: UPDATE_COMBAT,
    id,
    updates
  };
}

export function deleteCombat(id) {
  return {
    type: DELETE_COMBAT,
    id
  };
}

export function addCombats(combats) {
  return {
    type: ADD_COMBATS,
    combats
  };
}

export function clear() {
  return {
    type: CLEAR
  };
}

export function startAddCombat(combat) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const combatRef = firebaseRef.child(`users/${uid}/combats`).push(combat);

    return combatRef.then(() => {
      dispatch(addCombat({
        ...combat,
        id: combatRef.key
      }));
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startUpdateCombat(id, combat) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const combatRef = firebaseRef.child(`users/${uid}/combats/${id}`);

    const updates = {
      ...combat
    };

    return combatRef.update(updates).then(() => {
      dispatch(updateCombat(id, updates));
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startDeleteCombat(id) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const combatRef = firebaseRef.child(`users/${uid}/combats/${id}`);

    return combatRef.remove().then(() => {
      dispatch(deleteCombat(id));
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startAddCombats() {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const combatsRef = firebaseRef.child(`users/${uid}/combats`);

    return combatsRef.once('value').then((snapshot) => {
      const combats = snapshot.val() || {};
      const parsedCombats = [];

      Object.keys(combats).forEach((combatId) => {
        parsedCombats.push({
          id: combatId,
          ...combats[combatId]
        });
      });

      dispatch(addCombats(parsedCombats));
    });
  };
}
