import Immutable from 'immutable';
import {routerActions} from 'react-router-redux';
import firebase, {firebaseRef} from 'utils/firebase';

const initialState = Immutable.List();

export const ADD_CHARACTER = 'ADD_CHARACTER';
export const UPDATE_CHARACTER = 'UPDATE_CHARACTER';
export const DELETE_CHARACTER = 'DELETE_CHARACTER';
export const ADD_CHARACTERS = 'ADD_CHARACTERS';
export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';

export default function reducer(characters = initialState, action = {}) {
  switch (action.type) {
  case ADD_CHARACTER:
    return characters.push(action.character);
  case UPDATE_CHARACTER:
    return characters.map((character) => {
      if (character.id === action.id) {
        return {
          ...character,
          ...action.updates
        };
      }
      return character;
    });
  case DELETE_CHARACTER:
    return characters.filterNot((character) => {
      return character.id === action.id;
    });
  case ADD_CHARACTERS:
    return characters.push(...action.characters);
  case UPLOAD_IMAGE:
    return characters.map((character) => {
      if (character.id === action.id) {
        return {
          ...character,
          imageURL: action.imageURL
        };
      }
      return character;
    });
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

export function updateCharacter(id, updates) {
  return {
    type: UPDATE_CHARACTER,
    id,
    updates
  };
}

export function deleteCharacter(id) {
  return {
    type: DELETE_CHARACTER,
    id
  };
}

export function addCharacters(characters) {
  return {
    type: ADD_CHARACTERS,
    characters
  };
}

export function uploadImage(id, imageURL) {
  return {
    type: UPLOAD_IMAGE,
    id,
    imageURL
  };
}

export function startUploadImage(id, image) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const characterRef = firebaseRef.child(`users/${uid}/characters/${id}`);
    const imageRef = firebase.storage().ref().child(`users/${uid}/characters/${id}/avatar.png`);

    return imageRef.put(image).then(() => {
      imageRef.getDownloadURL().then((url) => {
        characterRef.update({imageURL: url});
        dispatch(uploadImage(characterRef.key, url));
      });
    });
  };
}

export function startAddCharacter(character, image) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const characterRef = firebaseRef.child(`users/${uid}/characters`).push(character);

    return characterRef.then(() => {
      if (image) {
        dispatch(startUploadImage(characterRef.key, image));
      }
      dispatch(addCharacter({
        ...character,
        id: characterRef.key
      }));
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startUpdateCharacter(id, character, image) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const characterRef = firebaseRef.child(`users/${uid}/characters/${id}`);

    const updates = {
      name: character.name,
      race: character.race,
      klass: character.klass,
      hp: character.hp,
      ac: character.ac
    };

    return characterRef.update(updates).then(() => {
      if (image) {
        dispatch(startUploadImage(characterRef.key, image));
      }
      dispatch(updateCharacter(id, updates));
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startDeleteCharacter(id) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const characterRef = firebaseRef.child(`users/${uid}/characters/${id}`);
    const imageRef = firebase.storage().ref().child(`users/${uid}/characters/`);

    return characterRef.remove().then(() => {
      imageRef.delete();
      dispatch(deleteCharacter(id));
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
