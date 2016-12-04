import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {hasError} from 'utils/errors';
import CharacterCard from 'components/CharacterCard';

import * as combatActions from 'reducers/combat';

import backImg from 'images/back.svg';
import addImg from 'images/add.svg';

/* eslint react/jsx-handler-names: 0 */
class EditCombat extends React.Component {
  static propTypes = {
    characters: React.PropTypes.object,
    combat: React.PropTypes.object,
    createCombat: React.PropTypes.func.isRequired,
    deleteCombat: React.PropTypes.func.isRequired,
    isNew: React.PropTypes.bool,
    updateCombat: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    const {combat} = props;

    this.state = {
      charactersInCombat: combat && combat.charactersInCombat ? combat.charactersInCombat : [],
      characterOrder: 'Name',
      confirmDelete: false,
      errors: [],
      search: '',
      updated: false
    };
  }

  validate = () => {
    const errors = [];
    const name = this.refs.name.value;

    if (_.isEmpty(name)) {
      errors.push('nameEmpty');
    }

    this.setState({errors});
    return !errors.length;
  }

  handleDeleteCombat = () => {
    this.setState({confirmDelete: true});
  }

  handleConfirmDeleteCombat = () => {
    const {combat} = this.props;
    this.props.deleteCombat(combat.id);
  }

  handleSaveCombat = (e) => {
    e.preventDefault();
    const {combat, isNew} = this.props;
    const {charactersInCombat} = this.state;
    const name = this.refs.name.value;
    const description = this.refs.description.value;

    _.each(charactersInCombat, (c) => {
      if (!c.user) {c.isNPC = true;}
      if (c.isRemoved === undefined) {
        c.isRemoved = false;
      }
    });

    const combObj = {name, description, charactersInCombat};

    if (isNew) {
      combObj.createdAt = moment().unix();
      combObj.isStarted = false;
      combObj.isActive = false;
      combObj.turns = 1;
      combObj.rounds = 1;
      combObj.actions = [{type: -1}];
      combObj.undoIndex = 0;
    }

    if (this.validate()) {
      if (isNew) {
        this.props.createCombat(combObj);
      } else {
        this.props.updateCombat(combat.id, combObj, '#');
      }
      browserHistory.goBack();
    }
  }

  handleSelectCharacter = (c) => {
    return (e) => {
      e.preventDefault();
      const {charactersInCombat} = this.state;
      const combatCharacters = this.getCombatCharacters(charactersInCombat, c);

      if (!combatCharacters) {
        this.addCharacterCopy(c);
      } else if (this.hasActiveCopies(combatCharacters, c)) {
        _.each(combatCharacters, (char) => {
          char.isRemoved = true;
        });
      } else {
        _.each(combatCharacters, (char) => {
          char.isRemoved = false;
        });
      }

      this.setState({charactersInCombat});
    };
  }

  hasActiveCopies = (combatCharacters, char) => {
    let result = false;
    _.each(combatCharacters, (c) => {
      if (c.id === char.id) {
        if (!c.isRemoved) {
          result = true;
          return false;
        }
      }
    });
    return result;
  }

  getCombatCharacters = (charArray, char) => {
    let result = false;

    _.each(charArray, (c) => {
      if (c.id === char.id) {
        if (!result) {result = [];}
        result.push(c);
      }
    });

    return result;
  }

  addCharacterCopy = (character) => {
    const {charactersInCombat} = this.state;
    const newChar = {...character};
    const combatCharacters = this.getCombatCharacters(charactersInCombat, character);
    const nameIndex = combatCharacters.length || 0;
    if (combatCharacters) {
      newChar.name += ` ${nameIndex + 1}`;
      if (combatCharacters.length === 1) {
        combatCharacters[0].name += ' 1';
      }
    }
    newChar.copy = nameIndex;
    newChar.isRemoved = false;
    charactersInCombat.push(newChar);
    this.setState({charactersInCombat});
  }

  handleAddCopy = (c) => {
    return (e) => {
      e.preventDefault();
      this.addCharacterCopy(c);
    };
  }

  handleToggleRemoveCopy = (c) => {
    return (e) => {
      e.preventDefault();
      const {charactersInCombat} = this.state;
      _.each(charactersInCombat, (char) => {
        if (c.id === char.id && c.copy === char.copy) {
          char.isRemoved = !char.isRemoved;
        }
      });
      this.setState({charactersInCombat});
    };
  }

  handleCharacterOrder = (e) => {
    this.setState({characterOrder: e.target.value});
  }

  handleSearch = (e) => {
    this.setState({search: e.target.value});
  }

  search = (c) => {
    const {search} = this.state;
    const text = c.name + c.race + c.klass + c.notes;
    return text.toLowerCase().includes(search.toLowerCase());
  }

  render() {
    const {charactersInCombat, characterOrder, confirmDelete, errors} = this.state;
    const {characters, combat, isNew} = this.props;

    return (
      <div className="page">
        <div className="page-header">
          <button className="btn-back pull-left" onClick={browserHistory.goBack}>
            <img src={backImg} />
          </button>
          <div className="page-title vcenter center">{isNew ? 'Create combat' : 'Edit combat'}</div>
        </div>
        <div className="page-content">
          <form onSubmit={this.handleSaveCombat}>
            {hasError(errors, ['nameEmpty']) && <div className="alert alert-error">Enter combat name</div>}
            <div className="form-field">
              <input
                className={classNames({'input-error': hasError(errors, ['nameEmpty'])})}
                defaultValue={combat ? combat.name : ''}
                placeholder="name"
                type="text"
                ref="name" />
            </div>
            <div className="form-field">
              <textarea
                defaultValue={combat ? combat.description : ''}
                placeholder="description"
                type="text"
                ref="description" />
            </div>
            <div className="page-subtitle character-header">
              <div>NPCs</div>
              <div className="options">
                <select
                  onChange={this.handleCharacterOrder}
                  ref="characterOrder" >
                  <option>Name</option>
                  <option>Created</option>
                  <option>Class</option>
                </select>
                <input type="text" placeholder="Search" onChange={this.handleSearch} />
              </div>
            </div>
            <div className="card-container scroll scroll-characters card-field">
              {!characters.isEmpty()
                ? characters.filter((c) => {
                  return this.search(c);
                }).sort((a, b) => {
                  let x = 0;
                  let y = 0;
                  switch (characterOrder) {
                  case 'Name':
                    x = a.name;
                    y = b.name;
                    break;
                  case 'Created':
                    x = a.createdAt || 0;
                    y = b.createdAt || 0;
                    break;
                  default:
                    x = a.klass;
                    y = b.klass;
                  }
                  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                }).map((c, i) => {
                  const combatCharacters = this.getCombatCharacters(charactersInCombat, c);
                  return (
                      <div
                        key={i}
                        className="card-wrapper">
                        <div onClick={this.handleSelectCharacter(c, i)}>
                          <CharacterCard
                            character={c}
                            selectable={true}
                            isDM={true}
                            isEditCombat={true}
                            isSelected={combatCharacters && this.hasActiveCopies(combatCharacters, c)} />
                          </div>
                        {combatCharacters &&
                          <div className="copies-container">
                            {combatCharacters.map((char, index) => {
                              return (
                                <div
                                  key={index}
                                  className={classNames('copy', {'copy-active': !char.isRemoved}, {'copy-removed': char.isRemoved})}
                                  onClick={this.handleToggleRemoveCopy(char)}>
                                    {char.copy + 1}
                                </div>
                              );
                            })}
                            <div className="add-copy" onClick={this.handleAddCopy(c)}>
                              <img src={addImg} />
                            </div>
                          </div>
                        }
                      </div>
                  );
                })
                : <div className="combats-empty center">No characters</div>
              }
            </div>
            <div className="form-field center">
              <button className="btn btn-action full-width" type="submit" onClick={this.handleSaveCombat}>
                {isNew ? 'Create combat' : 'Save combat'}
              </button>
            </div>
          </form>
          {confirmDelete && <div className="form-field confirm-delete">Are you sure you want to delete this combat?</div>}
          <div className="form-field">
            {!isNew && (confirmDelete
              ? <button className="btn btn-delete full-width" onClick={this.handleConfirmDeleteCombat}>
                Confirm delete
              </button>
              : <button className="btn btn-delete full-width" onClick={this.handleDeleteCombat}>
                Delete combat
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
    const {combatIndex} = props.params;

    const combat = state.combats.get(combatIndex);

    return {
      characters: state.characters,
      combat
    };
  }

  return {
    characters: state.characters
  };
}, {
  createCombat: combatActions.startAddCombat,
  updateCombat: combatActions.startUpdateCombat,
  deleteCombat: combatActions.startDeleteCombat
})(EditCombat);
