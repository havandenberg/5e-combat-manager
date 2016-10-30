import Immutable from 'immutable';
import {routerActions} from 'react-router-redux';
import {firebaseRef} from 'utils/firebase';

const initialState = Immutable.List();

export const ADD_CHARACTER = 'ADD_CHARACTER';
export const UPDATE_CHARACTER = 'UPDATE_CHARACTER';
export const ADD_CHARACTERS = 'ADD_CHARACTERS';

export default function reducer(characters = initialState, action = {}) {
  switch (action.type) {
  case ADD_CHARACTER:
    return characters.push(action.character);
  case UPDATE_CHARACTER:
    return characters.push(action.character);
  case ADD_CHARACTERS:
    return characters.push(...action.characters);
  default:
    return characters;
  }
}

export function addCharacter(character) {
  return {
    type: ADD_CHARACTER,
    character
  };
}

export function updateCharacter(character) {
  return {
    type: UPDATE_CHARACTER,
    character
  };
}

export function addCharacters(characters) {
  return {
    type: ADD_CHARACTERS,
    characters
  };
}

export function startAddCharacter(character) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const characterRef = firebaseRef.child(`users/${uid}/characters`).push(character);

    return characterRef.then(() => {
      dispatch(addCharacter({
        ...character,
        id: characterRef.key
      }));
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startUpdateCharacter(character) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const characterRef = firebaseRef.child(`users/${uid}/characters`).push(character);

    return characterRef.then(() => {
      dispatch(updateCharacter(character));
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startAddCharacters() {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const charactersRef = firebaseRef.child(`users/${uid}/characters`);

    return charactersRef.once('value').then((snapshot) => {
      const characters = snapshot.val() || {};
      const parsedCharacters = [];

      Object.keys(characters).forEach((characterId) => {
        parsedCharacters.push({
          id: characterId,
          ...characters[characterId]
        });
      });

      dispatch(addCharacters(parsedCharacters));
    });
  };
}
