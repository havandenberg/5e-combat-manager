import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {hasError} from 'utils/errors';
import {getModifier, scrollTo} from 'utils/resources';
import Dropzone from 'react-dropzone';

import * as characterActions from 'reducers/character';

import backImg from 'images/back.svg';

class EditCharacter extends React.Component {
  static propTypes = {
    character: React.PropTypes.object,
    createCharacter: React.PropTypes.func.isRequired,
    deleteCharacter: React.PropTypes.func.isRequired,
    isDM: React.PropTypes.bool,
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

  componentWillMount() {
    scrollTo();
  }

  validate = () => {
    const errors = [];
    const name = this.refs.name.value;
    const hp = this.refs.hp.value;
    const ac = this.refs.ac.value;
    const str = this.refs.str.value;
    const dex = this.refs.dex.value;
    const con = this.refs.con.value;
    const int = this.refs.int.value;
    const wis = this.refs.wis.value;
    const cha = this.refs.cha.value;

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

    if (!_.isEmpty(str) && !/^[0-9]\d*$/.test(str)) {
      errors.push('strNaN');
    }

    if (!_.isEmpty(dex) && !/^[0-9]\d*$/.test(dex)) {
      errors.push('dexNaN');
    }

    if (!_.isEmpty(con) && !/^[0-9]\d*$/.test(con)) {
      errors.push('conNaN');
    }

    if (!_.isEmpty(int) && !/^[0-9]\d*$/.test(int)) {
      errors.push('intNaN');
    }

    if (!_.isEmpty(wis) && !/^[0-9]\d*$/.test(wis)) {
      errors.push('wisNaN');
    }

    if (!_.isEmpty(cha) && !/^[0-9]\d*$/.test(cha)) {
      errors.push('chaNaN');
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

  handleSaveCharacter = (e) => {
    e.preventDefault();
    if (this.validate()) {
      const {character, isDM, isNew} = this.props;
      const {files} = this.state;
      const image = files.length > 0 ? files[0] : null;
      const name = this.refs.name.value;
      const race = this.refs.race.value;
      const klass = this.refs.klass.value;
      const notes = this.refs.notes ? this.refs.notes.value : '';
      const hp = parseInt(this.refs.hp.value, 10);
      const ac = parseInt(this.refs.ac.value, 10);
      const str = parseInt(this.refs.str.value, 10) || '';
      const dex = parseInt(this.refs.dex.value, 10) || '';
      const con = parseInt(this.refs.con.value, 10) || '';
      const int = parseInt(this.refs.int.value, 10) || '';
      const wis = parseInt(this.refs.wis.value, 10) || '';
      const cha = parseInt(this.refs.cha.value, 10) || '';

      const charObj = {name, race, klass, hp, ac, str, dex, con, int, wis, cha, notes};

      if (isNew) {
        if (isDM) {charObj.isLocked = true;}
        charObj.createdAt = moment().unix();
      }

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
      <div className="page edit-character">
        <div className="page-header">
          <Link to="/dashboard"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          <div className="page-title vcenter center">{isNew ? 'Create character' : 'Edit character'}</div>
        </div>
        <div className="page-content">
          <form onSubmit={this.handleSaveCharacter}>
            <div className="form-field drag-and-drop">
              <Dropzone ref="dropzone" onDrop={this.handleDrop}>
                {(!updated && character && character.imageURL)
                  ? <img src={character.imageURL} className="character-avatar" />
                  : <div>{files.map((file, i) => <img src={file.preview} className="character-avatar" key={i} />)}</div>}
              </Dropzone>
              <div className="upload-file">Upload avatar image</div>
            </div>
            {hasError(errors, ['nameEmpty']) && <div className="alert alert-error">Enter character name</div>}
            <div className={classNames('form-label', {'form-label__error': hasError(errors, ['nameEmpty'])})}>Name</div>
            <div className="form-field">
              <input
                className={classNames({'input-error': hasError(errors, ['nameEmpty'])})}
                defaultValue={character ? character.name : ''}
                placeholder="name"
                type="text"
                ref="name" />
            </div>
            <div className="form-label">Race</div>
            <div className="form-field">
              <input
                defaultValue={character ? character.race : ''}
                placeholder="race"
                type="text"
                ref="race" />
            </div>
            <div className="form-label">Class</div>
            <div className="form-field">
              <input
                defaultValue={character ? character.klass : ''}
                placeholder="class (lv)"
                type="text"
                ref="klass" />
            </div>
            {hasError(errors, ['hpEmpty']) && <div className="alert alert-error">Enter base hp</div>}
            {hasError(errors, ['acEmpty']) && <div className="alert alert-error">Enter base ac</div>}
            {hasError(errors, ['hpNaN']) && <div className="alert alert-error">HP must be a number</div>}
            {hasError(errors, ['acNaN']) && <div className="alert alert-error">AC must be a number</div>}
            <div className="form-field character-stats">
              <div>
                <div className={
                  classNames('form-label', 'center', {'form-label__error': hasError(errors, ['hpEmpty', 'hpNAN'])})}>HP</div>
                <input
                  className={classNames({'input-error': hasError(errors, ['hpEmpty', 'hpNaN'])})}
                  defaultValue={character ? character.hp : ''}
                  placeholder="base hp"
                  type="text"
                  ref="hp" />
              </div>
              <div>
                <div className={
                  classNames('form-label', 'center', {'form-label__error': hasError(errors, ['acEmpty', 'acNAN'])})}>AC</div>
                <input
                  className={classNames({'input-error': hasError(errors, ['acEmpty', 'acNaN'])})}
                  defaultValue={character ? character.ac : ''}
                  placeholder="ac"
                  type="text"
                  ref="ac" />
              </div>
            </div>
            {hasError(errors, ['strNaN']) && <div className="alert alert-error">STR must be a number</div>}
            {hasError(errors, ['dexNaN']) && <div className="alert alert-error">DEX must be a number</div>}
            {hasError(errors, ['conNaN']) && <div className="alert alert-error">CON must be a number</div>}
            {hasError(errors, ['intNaN']) && <div className="alert alert-error">INT must be a number</div>}
            {hasError(errors, ['wisNaN']) && <div className="alert alert-error">WIS must be a number</div>}
            {hasError(errors, ['chaNaN']) && <div className="alert alert-error">CHA must be a number</div>}
            <div className="form-field character-stats character-stats--base">
              <div>
                <div className={
                  classNames('form-label', 'center', {'form-label__error': hasError(errors, ['strEmpty', 'strNAN'])})}>STR</div>
                <input
                  className={classNames({'input-error': hasError(errors, ['strNaN'])})}
                  defaultValue={character ? character.str : ''}
                  placeholder="STR"
                  type="text"
                  ref="str" />
                {character && getModifier(character.str) &&
                  <div className="character-stats--modifier center">{getModifier(character.str)}</div>
                }
              </div>
              <div>
                <div className={
                  classNames('form-label', 'center', {'form-label__error': hasError(errors, ['dexEmpty', 'dexNAN'])})}>DEX</div>
                <input
                  className={classNames('form-field', {'input-error': hasError(errors, ['dexNaN'])})}
                  defaultValue={character ? character.dex : ''}
                  placeholder="DEX"
                  type="text"
                  ref="dex" />
                {character && getModifier(character.dex) &&
                  <div className="character-stats--modifier center">{getModifier(character.dex)}</div>
                }
              </div>
              <div>
                <div className={
                  classNames('form-label', 'center', {'form-label__error': hasError(errors, ['conEmpty', 'conNAN'])})}>CON</div>
                <input
                  className={classNames({'input-error': hasError(errors, ['conNaN'])})}
                  defaultValue={character ? character.con : ''}
                  placeholder="CON"
                  type="text"
                  ref="con" />
                {character && getModifier(character.con) &&
                  <div className="character-stats--modifier center">{getModifier(character.con)}</div>
                }
              </div>
              <div>
                <div className={
                  classNames('form-label', 'center', {'form-label__error': hasError(errors, ['intEmpty', 'intNAN'])})}>INT</div>
                <input
                  className={classNames({'input-error': hasError(errors, ['intNaN'])})}
                  defaultValue={character ? character.int : ''}
                  placeholder="INT"
                  type="text"
                  ref="int" />
                {character && getModifier(character.int) &&
                  <div className="character-stats--modifier center">{getModifier(character.int)}</div>
                }
              </div>
              <div>
                <div className={
                  classNames('form-label', 'center', {'form-label__error': hasError(errors, ['wisEmpty', 'wisNAN'])})}>WIS</div>
                <input
                  className={classNames({'input-error': hasError(errors, ['wisNaN'])})}
                  defaultValue={character ? character.wis : ''}
                  placeholder="WIS"
                  type="text"
                  ref="wis" />
                {character && getModifier(character.wis) &&
                  <div className="character-stats--modifier center">{getModifier(character.wis)}</div>
                }
              </div>
              <div>
                <div className={
                  classNames('form-label', 'center', {'form-label__error': hasError(errors, ['chaEmpty', 'chaNAN'])})}>CHA</div>
                <input
                  className={classNames({'input-error': hasError(errors, ['chaNaN'])})}
                  defaultValue={character ? character.cha : ''}
                  placeholder="CHA"
                  type="text"
                  ref="cha" />
                {character && getModifier(character.cha) &&
                  <div className="character-stats--modifier center">{getModifier(character.cha)}</div>
                }
              </div>
            </div>
            <div className="form-field notes">
              <div className="form-label">Notes</div>
              <textarea
                defaultValue={character ? character.notes : ''}
                placeholder="notes"
                type="text"
                ref="notes" />
            </div>
            <div className="form-field center">
              <button className="btn btn-action full-width" type="submit" onClick={this.handleSaveCharacter}>
                {isNew ? 'Create character' : 'Save character'}
              </button>
            </div>
          </form>
          {confirmDelete && <div className="form-field center confirm-delete">Are you sure you want to delete this character?</div>}
          <div className="form-field center">
            {!isNew && (confirmDelete
              ? <button className="btn btn-delete full-width" onClick={this.handleConfirmDeleteCharacter}>
                Confirm delete
              </button>
              : <button className="btn btn-delete full-width" onClick={this.handleDeleteCharacter}>
                Delete character
              </button>)
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
      character,
      isDM: state.auth.get('isDM')
    };
  }

  return {
    isDM: state.auth.get('isDM')
  };
}, {
  createCharacter: characterActions.startAddCharacter,
  updateCharacter: characterActions.startUpdateCharacter,
  deleteCharacter: characterActions.startDeleteCharacter
})(EditCharacter);
