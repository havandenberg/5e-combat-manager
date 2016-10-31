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
    updateCharacter: React.PropTypes.func.isRequired,
    uploadImage: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      errors: []
    };
  }

  validate = () => {
    const errors = [];
    const name = this.refs.name.value;

    if (_.isEmpty(name)) {
      errors.push('nameEmpty');
    }

    this.setState({errors});
    return (!errors.length);
  }

  handleDrop = (files) => {
    this.props.uploadImage(this.props.character.id, files[0]);
  }

  handleOpenClick = () => {
    this.refs.dropzone.open();
  }

  handleDeleteCharacter = () => {
    const {character} = this.props;
    this.props.deleteCharacter(character.id);
  }

  handleSaveCharacter = () => {
    const {character, isNew} = this.props;
    const name = this.refs.name.value;
    const race = this.refs.race.value;
    const klass = this.refs.klass.value;
    const hp = this.refs.hp.value;
    const ac = this.refs.ac.value;

    const charObj = {name, race, klass, hp, ac};

    if (this.validate()) {
      if (isNew) {
        this.props.createCharacter(charObj);
        return;
      }
      this.props.updateCharacter(character.id, charObj);
    }
  }

  render() {
    const {errors} = this.state;
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
            {character && character.imageURL && <img src={character.imageURL} className="character-avatar" />}
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
          <div className="form-field character-stats">
            <input
              defaultValue={character ? character.hp : ''}
              placeholder="base hp"
              type="text"
              ref="hp" />
            <input
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
          <div className="form-field">
            {!isNew &&
              <button className="btn btn-delete full-width" onClick={this.handleDeleteCharacter}>
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
  deleteCharacter: characterActions.startDeleteCharacter,
  uploadImage: characterActions.startUploadImage
})(ViewCharacter);
