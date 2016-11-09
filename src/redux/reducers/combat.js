import Immutable from 'immutable';
import {routerActions} from 'react-router-redux';
import {firebaseRef} from 'utils/firebase';

const initialState = Immutable.List();

export const ADD_COMBATS = 'ADD_COMBATS';
export const CLEAR_COMBATS = 'CLEAR_COMBATS';

export default function reducer(combats = initialState, action = {}) {
  switch (action.type) {
  case ADD_COMBATS:
    return combats.clear().push(...action.combats);
  case CLEAR_COMBATS:
    return initialState;
  default:
    return combats;
  }
}

export function addCombats(combats) {
  return {
    type: ADD_COMBATS,
    combats
  };
}

export function clearCombats() {
  return {
    type: CLEAR_COMBATS
  };
}

export function startAddCombat(combat) {
  return (dispatch) => {
    const combatRef = firebaseRef.child('combats').push(combat);

    return combatRef.then(() => {
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startUpdateCombat(id, combat, next) {
  return (dispatch) => {
    const combatRef = firebaseRef.child(`combats/${id}`);

    const updates = {
      ...combat
    };

    return combatRef.update(updates).then(() => {
      if (next !== '#') {dispatch(routerActions.push(next ? next : '/dashboard'));}
    });
  };
}

export function startDeleteCombat(id) {
  return (dispatch) => {
    const combatRef = firebaseRef.child(`combats/${id}`);

    return combatRef.remove().then(() => {
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startAddCombats() {
  return (dispatch) => {
    const combatsRef = firebaseRef.child('combats');

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

export function listenForCombatChanges() {
  return (dispatch) => {
    firebaseRef.child('combats').on('value', (snapshot) => {
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
