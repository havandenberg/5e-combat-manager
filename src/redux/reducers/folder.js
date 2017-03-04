import Immutable from 'immutable';
import {routerActions} from 'react-router-redux';
import {firebaseRef} from 'utils/firebase';

const initialState = Immutable.List();

export const ADD_FOLDERS = 'ADD_FOLDERS';
export const CLEAR_FOLDERS = 'CLEAR_FOLDERS';

export default function reducer(folders = initialState, action = {}) {
  switch (action.type) {
  case ADD_FOLDERS:
    return folders.clear().push(...action.folders);
  case CLEAR_FOLDERS:
    return initialState;
  default:
    return folders;
  }
}

export function addFolders(folders) {
  return {
    type: ADD_FOLDERS,
    folders
  };
}

export function clearFolders() {
  return {
    type: CLEAR_FOLDERS
  };
}

export function startAddFolder(folder, location) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const folderRef = firebaseRef.child(`users/${uid}/folders/${location}`).push(folder);

    return folderRef.then(() => {
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startUpdateFolder(folder, location, next) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const folderRef = firebaseRef.child(`users/${uid}/folders/${location}`);

    const updates = {
      ...folder,
      id: null
    };

    return folderRef.update(updates).then(() => {
      if (next !== '#') {dispatch(routerActions.push(next ? next : '/dashboard'));}
    });
  };
}

export function startDeleteFolder(id, location) {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const folderRef = firebaseRef.child(`users/${uid}/folders/${location}/${id}`);

    return folderRef.remove().then(() => {
      dispatch(routerActions.push('/dashboard'));
    });
  };
}

export function startAddFolders() {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    const foldersRef = firebaseRef.child(`users/${uid}/folders`);

    return foldersRef.once('value').then((snapshot) => {
      const folders = snapshot.val() || {};
      const parsedFolders = [];

      Object.keys(folders).forEach((folderId) => {
        parsedFolders.push({
          id: folderId,
          ...folders[folderId]
        });
      });

      dispatch(addFolders(parsedFolders));
    });
  };
}

export function listenForFolderChanges() {
  return (dispatch, getState) => {
    const uid = getState().auth.get('uid');
    firebaseRef.child(`users/${uid}/folders`).on('value', (snapshot) => {
      const folders = snapshot.val() || {};
      const parsedFolders = [];

      Object.keys(folders).forEach((folderId) => {
        parsedFolders.push({
          id: folderId,
          ...folders[folderId]
        });
      });

      dispatch(addFolders(parsedFolders));
    });
  };
}
