import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {hasError} from 'utils/errors';
import Dropzone from 'react-dropzone';

import * as characterActions from 'reducers/character';

import backImg from 'images/back.svg';

class ViewCharacter extends React.Component {
  static propTypes = {
    character: React.PropTypes.object,
    createCharacter: React.PropTypes.func.isRequired,
    deleteCharacter: React.PropTypes.func.isRequired,
    isNew: React.PropTypes.bool,
    updateCharacter: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      confirmDelete: false,
      errors: [],
      files: [],
      updated: false
    };
  }

  validate = () => {
    const errors = [];
    const name = this.refs.name.value;
    const hp = this.refs.hp.value;
    const ac = this.refs.ac.value;

    if (_.isEmpty(name)) {
      errors.push('nameEmpty');
    }

    if (_.isEmpty(hp)) {
      errors.push('hpEmpty');
    } else if (!/^[0-9]\d*$/.test(hp)) {
      errors.push('hpNaN');
    }

    if (_.isEmpty(ac)) {
      errors.push('acEmpty');
    } else if (!/^[0-9]\d*$/.test(ac)) {
      errors.push('acNaN');
    }

    this.setState({errors});
    return (!errors.length);
  }

  handleDrop = (files) => {
    this.setState({files, updated: true});
  }

  handleOpenClick = () => {
    this.refs.dropzone.open();
  }

  handleDeleteCharacter = () => {
    this.setState({confirmDelete: true});
  }

  handleConfirmDeleteCharacter = () => {
    const {character} = this.props;
    this.props.deleteCharacter(character.id);
  }

  handleSaveCharacter = () => {
    const {character, isNew} = this.props;
    const {files} = this.state;
    const image = files.length > 0 ? files[0] : null;
    const name = this.refs.name.value;
    const race = this.refs.race.value;
    const klass = this.refs.klass.value;
    const hp = this.refs.hp.value;
    const ac = this.refs.ac.value;

    const charObj = {name, race, klass, hp, ac};

    if (this.validate()) {
      if (isNew) {
        this.props.createCharacter(charObj, image);
      } else {
        this.props.updateCharacter(character.id, charObj, image);
      }
    }
  }

  render() {
    const {confirmDelete, errors, files, updated} = this.state;
    const {character, isNew} = this.props;

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/dashboard"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          <div className="page-title vcenter center">{isNew ? 'Create character' : 'Edit character'}</div>
        </div>
        <div className="page-content">
          <div className="form-field drag-and-drop">
            <Dropzone ref="dropzone" onDrop={this.handleDrop}>
              {(!updated && character && character.imageURL)
                ? <img src={character.imageURL} className="character-avatar" />
                : <div>{files.map((file, i) => <img src={file.preview} className="character-avatar" key={i} />)}</div>}
            </Dropzone>
            <div className="upload-file">Upload avatar image</div>
          </div>
          {hasError(errors, ['nameEmpty']) && <div className="alert alert-error">Enter character name</div>}
          <div className="form-field">
            <input
              className={classNames({'input-error': hasError(errors, ['nameEmpty'])})}
              defaultValue={character ? character.name : ''}
              placeholder="name"
              type="text"
              ref="name" />
          </div>
          <div className="form-field">
            <input
              defaultValue={character ? character.race : ''}
              placeholder="race"
              type="text"
              ref="race" />
          </div>
          <div className="form-field">
            <input
              defaultValue={character ? character.klass : ''}
              placeholder="class"
              type="text"
              ref="klass" />
          </div>
          {hasError(errors, ['hpEmpty']) && <div className="alert alert-error">Enter base hp</div>}
          {hasError(errors, ['acEmpty']) && <div className="alert alert-error">Enter base ac</div>}
          {hasError(errors, ['hpNaN']) && <div className="alert alert-error">HP must be a number</div>}
          {hasError(errors, ['acNaN']) && <div className="alert alert-error">AC must be a number</div>}
          <div className="form-field character-stats">
            <input
              className={classNames({'input-error': hasError(errors, ['hpEmpty', 'hpNaN'])})}
              defaultValue={character ? character.hp : ''}
              placeholder="base hp"
              type="text"
              ref="hp" />
            <input
              className={classNames({'input-error': hasError(errors, ['acEmpty', 'acNaN'])})}
              defaultValue={character ? character.ac : ''}
              placeholder="ac"
              type="text"
              ref="ac" />
          </div>
          <div className="form-field center">
            <button className="btn btn-action full-width" onClick={this.handleSaveCharacter}>
              {isNew ? 'Create character' : 'Save character'}
            </button>
          </div>
          {confirmDelete && <div className="form-field confirm-delete">Are you sure you want to delete this character?</div>}
          <div className="form-field">
            {!isNew && confirmDelete
              ? <button className="btn btn-delete full-width" onClick={this.handleConfirmDeleteCharacter}>
                Confirm Delete
              </button>
              : <button className="btn btn-delete full-width" onClick={this.handleDeleteCharacter}>
                Delete Character
              </button>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state, props) => {
  if (!props.isNew) {
    const {characterIndex} = props.params;

    const character = state.characters.get(characterIndex);

    return {
      character
    };
  }

  return {};
}, {
  createCharacter: characterActions.startAddCharacter,
  updateCharacter: characterActions.startUpdateCharacter,
  deleteCharacter: characterActions.startDeleteCharacter
})(ViewCharacter);
