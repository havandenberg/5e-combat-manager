import Immutable from 'immutable';
import _ from 'lodash';
import {routerActions} from 'react-router-redux';
import firebase, {firebaseRef} from 'utils/firebase';

const initialState = Immutable.List();

export const ADD_CHARACTERS = 'ADD_CHARACTERS';
export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const CLEAR_CHARACTERS = 'CLEAR_CHARACTERS';

export default function reducer(characters = initialState, action = {}) {
  switch (action.type) {
  case ADD_CHARACTERS:
    return characters.clear().push(...action.characters);
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
  case CLEAR_CHARACTERS:
    return initialState;
  default:
    return characters;
  }
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

export function clearCharacters() {
  return {
    type: CLEAR_CHARACTERS
  };
}

export function startUploadImage(id, image) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const characterRef = firebaseRef.child(`users/${uid}/characters/${id}`);
    const imageRef = firebase.storage().ref().child(`users/${uid}/characters/${id}/avatar.png`);
    const combatsRef = firebaseRef.child('combats');

    return imageRef.put(image).then(() => {
      imageRef.getDownloadURL().then((url) => {
        characterRef.update({imageURL: url});
        combatsRef.once('value', (snap) => {
          snap.forEach((combatSnap) => {
            const combat = combatSnap.val();
            _.each(combat.charactersInCombat, (char, i) => {
              if (char.id === id) {
                const charRef = combatsRef.child(`${combat.id}/charactersInCombat/${i}`);
                charRef.update({imageURL: url});
              }
            });
          });
        });
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
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startUpdateCharacter(id, character, image) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const characterRef = firebaseRef.child(`users/${uid}/characters/${id}`);
    const combatsRef = firebaseRef.child('combats');

    const updates = {
      ...character
    };

    const combatUpdates = {
      name: character.name,
      race: character.race,
      klass: character.klass,
      notes: character.notes
    };

    combatsRef.once('value', (snap) => {
      snap.forEach((combatSnap) => {
        const combat = combatSnap.val();
        _.each(combat.charactersInCombat, (char, i) => {
          if (char.id === id) {
            const charRef = combatsRef.child(`${combat.id}/charactersInCombat/${i}`);
            charRef.update(combatUpdates);
          }
        });
      });
    });

    return characterRef.update(updates).then(() => {
      if (image) {
        dispatch(startUploadImage(characterRef.key, image));
      }
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startDeleteCharacter(id) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const characterRef = firebaseRef.child(`users/${uid}/characters/${id}`);
    const imageRef = firebase.storage().ref().child(`users/${uid}/characters/${id}/avatar.png`);
    const combatsRef = firebaseRef.child('combats');

    combatsRef.once('value', (snap) => {
      snap.forEach((combatSnap) => {
        const combat = combatSnap.val();
        _.each(combat.charactersInCombat, (char, i) => {
          if (char.id === id) {
            const charRef = combatsRef.child(`${combat.id}/charactersInCombat/${i}`);
            charRef.update({isRemoved: true});
          }
        });
      });
    });

    return characterRef.remove().then(() => {
      imageRef.delete();
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

export function listenForCharacterChanges() {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const charactersRef = firebaseRef.child(`users/${uid}/characters`);
    charactersRef.on('value', (snapshot) => {
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
