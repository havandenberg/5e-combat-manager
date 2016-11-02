import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {hasError} from 'utils/errors';
import CharacterCard from 'components/CharacterCard';

import * as combatActions from 'reducers/combat';

import backImg from 'images/back.svg';

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
      confirmDelete: false,
      errors: [],
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
    return (!errors.length);
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
      c.isNPC = true;
      if (c.isRemoved === undefined) {
        c.isRemoved = false;
      }
    });

    const combObj = {name, description, charactersInCombat};

    if (isNew) {
      combObj.createdAt = moment().unix();
      combObj.isStarted = false;
      combObj.isActive = false;
    }

    if (this.validate()) {
      if (isNew) {
        this.props.createCombat(combObj);
      } else {
        this.props.updateCombat(combat.id, combObj);
      }
    }
  }

  handleSelectCharacter = (c) => {
    return (e) => {
      e.preventDefault();
      const {charactersInCombat} = this.state;

      if (this.containsCharacter(charactersInCombat, c)) {
        if (this.getRemoved(c) !== undefined) {
          c.isRemoved = !c.isRemoved;
        }
      } else {charactersInCombat.push(c);}

      this.setState({charactersInCombat});
    };
  }

  containsCharacter = (charArray, char) => {
    let result = false;

    _.each(charArray, (c) => {
      result = result || c.id === char.id;
    });

    return result;
  }

  getRemoved = (c) => {
    let removed = false;
    _.each(this.state.charactersInCombat, (char) => {
      if (c.id === char.id) {
        removed = char.isRemoved;
      }
    });
    return removed;
  }

  render() {
    const {charactersInCombat, confirmDelete, errors} = this.state;
    const {characters, combat, isNew} = this.props;

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/dashboard"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
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
            <div className="page-subtitle">NPCs</div>
            <div className="card-container">
              {!characters.isEmpty()
                ? characters.map((c, i) => {
                  return (
                      <div
                        key={i}
                        className="card-wrapper"
                        onClick={this.handleSelectCharacter(c)}>
                        <CharacterCard
                          character={c}
                          selectable={true}
                          isSelected={this.containsCharacter(charactersInCombat, c) && !this.getRemoved(c)} />
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
                Confirm Delete
              </button>
              : <button className="btn btn-delete full-width" onClick={this.handleDeleteCombat}>
                Delete Combat
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
