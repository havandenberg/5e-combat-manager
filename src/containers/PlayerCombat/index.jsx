import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import StatBubble from 'components/StatBubble';
import CombatActions from 'components/CombatActions';
import Tag from 'components/Tag';

import * as combatActions from 'reducers/combat';

import backImg from 'images/back.svg';
import lockedImg from 'images/locked.svg';

class PlayerCombat extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    combat: React.PropTypes.object.isRequired,
    combatIndex: React.PropTypes.string.isRequired,
    uid: React.PropTypes.string.isRequired,
    updateCombat: React.PropTypes.func.isRequired
  }

  getNextTurns = () => {
    const {combat, character, uid} = this.props;
    let count = 0;
    _.each(combat.charactersInCombat, (c) => {
      if (c.user === uid && character.name === c.name) {return false;}
      count++;
    });
    return count;
  }

  getNextTurnsMessage = (nextTurns) => {
    switch (nextTurns) {
    case 0:
      return 'It\'s your turn!';
    case 1:
      return 'You\'re up next!';
    default:
      return `You\'re up in ${nextTurns} turns`;
    }
  }

  handleGoBack = () => {
    browserHistory.goBack();
  }

  handleEnterStats = () => {
    this.props.character.hp = this.refs.hp.value;
    this.props.character.ac = this.refs.ac.value;
    this.props.character.init = this.refs.init.value;
    this.updateCombat();
  }

  updateCombat = () => {
    const {combat, updateCombat} = this.props;
    updateCombat(combat.id, combat, '#');
  }

  render() {
    const {character, combat} = this.props;
    const nextTurns = this.getNextTurns();
    const isUpNow = nextTurns === 0;

    return (
      <div className="page">
        <div className="page-header">
          <button className="btn-back pull-left" onClick={this.handleGoBack}><img src={backImg} /></button>
          {character.isLocked &&
            <div className="pull-right">
              <img className="image-large" src={lockedImg} />
            </div>
          }
        </div>
        <div className="page-content page-content--combat">
          <div className="page-title center">
            <img src={character.imageURL} className="character-avatar--combat" />
          </div>
          <div className="page-title center">{character.name}</div>
          {!combat.isStarted && <div>
            <div className="page-subtitle center">Waiting for combat to start...</div>
            {!character.init &&
              <div className="enter-initial-stats center">
                <div className="left-align">HP</div>
                <div className="form-field">
                  <input
                    defaultValue={character.hp}
                    type="text"
                    ref="hp" />
                </div>
                <div className="left-align">AC</div>
                <div className="form-field">
                  <input
                    defaultValue={character.ac}
                    type="text"
                    ref="ac" />
                </div>
                <div className="left-align">Initiative</div>
                <div className="form-field">
                  <input
                    placeholder="Enter integer"
                    type="text"
                    ref="init" />
                </div>
                <button className="btn btn-action" onClick={this.handleEnterStats}>Set</button>
              </div>
            }
          </div>}
          {combat.isStarted && <div>
            <div className={classNames('page-subtitle',
              'center',
              'player-up',
              {'player-up-now': nextTurns === 0},
              {'player-up-next': nextTurns === 1})}>
              {this.getNextTurnsMessage(nextTurns)}
            </div>
            {character.tags &&
              <div className="card-field player-character-tag--container">
                {character.tags.map((t, i) => {
                  return (
                    <div className="player-character-tag" key={i}>
                      <Tag type={t.type} text={t.text} />
                    </div>
                  );
                })}
              </div>
            }
            <div className="combat-content">
              <StatBubble character={character} size="large" />
              <CombatActions character={character} combat={combat} isUpNow={isUpNow} updateCombat={this.updateCombat} />
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

export default connect((state, props) => {
  const {combatIndex, characterName} = props.params;
  const combat = state.combats.get(combatIndex);
  let character = {};

  _.each(combat.charactersInCombat, (c) => {
    if (c.user === state.auth.get('uid') && c.name === characterName) {
      character = c;
    }
  });

  return {
    character,
    combat,
    combatIndex,
    uid: state.auth.get('uid')
  };
}, {
  updateCombat: combatActions.startUpdateCombat
})(PlayerCombat);
