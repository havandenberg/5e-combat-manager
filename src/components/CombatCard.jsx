import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {Link} from 'react-router';
import Tag from 'components/Tag';
import ChooseCharacter from 'components/ChooseCharacter';

import settingsImg from 'images/settings.svg';
import eyeImg from 'images/eye.svg';

export default class CombatCard extends React.Component {
  static propTypes = {
    characterNames: React.PropTypes.array,
    chooseCharacter: React.PropTypes.func,
    combat: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    isAdding: React.PropTypes.bool,
    isDM: React.PropTypes.bool.isRequired,
    updateCombat: React.PropTypes.func,
    onToggleAdd: React.PropTypes.func
  }

  getCharacterNamesString = () => {
    const {characterNames} = this.props;
    let isFirst = true;
    let characterNamesString = '';
    _.each(characterNames, (name) => {
      if (!isFirst) {characterNamesString += ', ';}
      characterNamesString += name;
      if (isFirst) {isFirst = false;}
    });
    return characterNames.length > 0
      ? `Character${characterNames.length > 1 ? 's' : ''}: ${characterNamesString}`
      : 'No character in combat';
  }

  getStats = () => {
    const {charactersInCombat} = this.props.combat;
    let npcs = 0;
    let players = 0;

    if (charactersInCombat) {
      _.each(charactersInCombat, (c) => {
        if (!c.isRemoved) {
          if (c.isNPC) {
            npcs++;
          } else {
            players++;
          }
        }
      });
    }

    return {players, npcs};
  }

  handleToggleActive = () => {
    const {combat, updateCombat} = this.props;
    combat.isActive = !combat.isActive;
    updateCombat(combat.id, combat, '#');
  }

  handleToggleArchived = () => {
    const {combat, updateCombat} = this.props;
    combat.isArchived = !combat.isArchived;
    combat.isActive = false;
    updateCombat(combat.id, combat, '#');
  }

  handleToggleAdd = () => {
    this.props.onToggleAdd();
  }

  render() {
    const {chooseCharacter, combat, index, isAdding, isDM} = this.props;
    const stats = this.getStats();

    return (
      <div className="card card-space">
        <div className="card-text">
          <div className="card-name card-name--combat center">{combat.name}</div>
          <div className="card-field">{combat.description}</div>
          <div className="card-field">
            <div>Created on: {moment.unix(combat.createdAt).format('MM/DD/YYYY')}</div>
            <div>Players: {stats.players}</div>
            <div>NPCs: {stats.npcs}</div>
            <div>Round: {combat.rounds}</div>
            <div>Turn: {combat.turns}</div>
          </div>
        </div>
        {isDM &&
          <div>
            <Link className="no-decoration btn-settings" to={`/edit-combat/${index}`}>
              <img src={settingsImg} />
            </Link>
            <Link className="no-decoration btn-open-view circle" to={`/view-combat/${index}`}>
              <img src={eyeImg} />
            </Link>
            <div className="tag-combat-card" onClick={this.handleToggleActive}>
              <Tag type={combat.isActive ? 'active' : 'inactive'} />
            </div>
            <div className="tag-combat-card--archived" onClick={this.handleToggleArchived}>
              <Tag type={combat.isArchived ? 'unarchived' : 'archived'} text={combat.isArchived ? 'restore' : 'archive'} />
            </div>
          </div>
        }
        {!isDM &&
          <div className="card-field"><strong>Characters:</strong></div>
        }
        <div className="full-width center">
          {isDM
            ? <Link to={`/combat/${index}`}>
              <button className="btn btn-choose">Enter</button>
            </Link>
            : <ChooseCharacter
              chooseCharacter={chooseCharacter}
              combat={combat}
              combatIndex={index}
              onToggleAdd={this.handleToggleAdd}
              isAdding={isAdding} />
          }
        </div>
      </div>
    );
  }
}
