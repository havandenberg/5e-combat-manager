import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import StatBubble from 'components/StatBubble';
import CombatActions from 'components/CombatActions';

import * as combatActions from 'reducers/combat';

import backImg from 'images/back.svg';

class PlayerCombat extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    combat: React.PropTypes.object.isRequired,
    combatIndex: React.PropTypes.string.isRequired,
    uid: React.PropTypes.string.isRequired,
    updateCombat: React.PropTypes.func.isRequired
  }

  getNextTurns = () => {
    const {combat, uid} = this.props;
    let count = 0;
    _.each(combat.charactersInCombat, (c) => {
      if (c.user === uid) {return false;}
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

  handleEnterInitiative = () => {
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
          <Link to="/dashboard"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
        </div>
        <div className="page-content page-content--combat">
          <div className="page-title center">
            <img src={character.imageURL} className="character-avatar--combat" />
          </div>
          <div className="page-title center">{character.name}</div>
          {!combat.isStarted && <div>
            <div className="page-subtitle center">Waiting for combat to start...</div>
            {!character.init &&
              <div className="enter-initiative center">
                <div className="form-field">
                  <input
                    placeholder="1-20"
                    type="text"
                    ref="init" />
                </div>
                <button className="btn btn-action" onClick={this.handleEnterInitiative}>Enter initiative</button>
              </div>
            }
          </div>}
          {combat.isStarted && <div>
            <div className="page-subtitle center">{this.getNextTurnsMessage(nextTurns)}</div>
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
  const {combatIndex} = props.params;
  const combat = state.combats.get(combatIndex);
  let character = {};

  _.each(combat.charactersInCombat, (c) => {
    if (c.user === state.auth.get('uid')) {
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
