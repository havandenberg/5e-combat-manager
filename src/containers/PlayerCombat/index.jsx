import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import StatBubble from 'components/StatBubble';
import CombatActions from 'components/CombatActions';
import CharacterSwitcher from 'components/CharacterSwitcher';
import Tag from 'components/Tag';
import {hasError} from 'utils/errors';

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

  constructor() {
    super();

    this.state = {
      errors: []
    };
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
    if (this.props.character.hp <= 0) {return 'You\'re unconscious!';}
    switch (nextTurns) {
    case 0:
      return 'It\'s your turn!';
    case 1:
      return 'You\'re up next!';
    default:
      return `You\'re up in ${nextTurns} turns`;
    }
  }

  validate = () => {
    const errors = [];
    const hp = this.refs.hp.value;
    const ac = this.refs.ac.value;
    const init = this.refs.init.value;

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

    if (_.isEmpty(init)) {
      errors.push('initEmpty');
    } else if (!/^[0-9]\d*$/.test(init)) {
      errors.push('initNaN');
    }

    this.setState({errors});
    return (!errors.length);
  }

  handleEnterStats = () => {
    const {character} = this.props;
    if (this.validate()) {
      character.hp = parseInt(this.refs.hp.value, 10);
      character.ac = parseInt(this.refs.ac.value, 10);
      character.init = parseInt(this.refs.init.value, 10);
      this.updateCombat();
    }
  }

  updateCombat = () => {
    const {combat, updateCombat} = this.props;
    updateCombat(combat.id, combat, '#');
  }

  render() {
    const {character, combat, combatIndex} = this.props;
    const {errors} = this.state;
    const nextTurns = this.getNextTurns();
    const isUpNow = nextTurns === 0;

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/dashboard"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          {character.isLocked &&
            <div className="pull-right">
              <img className="image-large" src={lockedImg} />
            </div>
          }
        </div>
        <div className="page-content page-content--combat">
          <CharacterSwitcher combat={combat} combatIndex={combatIndex} />
          <div className="page-title center">
            <img src={character.imageURL} className="character-avatar--combat" />
          </div>
          <div className="page-title center">{character.name}</div>
          {!combat.isStarted && <div>
            <div className="page-subtitle center">Waiting for combat to start...</div>
            {!character.init &&
              <div className="enter-initial-stats center">
                {hasError(errors, ['hpEmpty']) && <div className="alert alert-error">Enter hp</div>}
                {hasError(errors, ['acEmpty']) && <div className="alert alert-error">Enter ac</div>}
                {hasError(errors, ['initEmpty']) && <div className="alert alert-error">Enter init</div>}
                {hasError(errors, ['hpNaN']) && <div className="alert alert-error">HP must be a number</div>}
                {hasError(errors, ['acNaN']) && <div className="alert alert-error">AC must be a number</div>}
                {hasError(errors, ['initNaN']) && <div className="alert alert-error">Init must be a number</div>}
                <div className={classNames('left-align', {'form-label__error': hasError(errors, ['hpEmpty', 'hpNaN'])})}>HP</div>
                <div className="form-field">
                  <input
                    className={classNames({'input-error': hasError(errors, ['hpEmpty', 'hpNaN'])})}
                    defaultValue={character.hp}
                    type="text"
                    ref="hp" />
                </div>
                <div className={classNames('left-align', {'form-label__error': hasError(errors, ['acEmpty', 'acNaN'])})}>AC</div>
                <div className="form-field">
                  <input
                    className={classNames({'input-error': hasError(errors, ['acEmpty', 'acNaN'])})}
                    defaultValue={character.ac}
                    type="text"
                    ref="ac" />
                </div>
                <div className={classNames('left-align', {'form-label__error': hasError(errors, ['initEmpty', 'initNaN'])})}>Init</div>
                <div className="form-field">
                  <input
                    className={classNames({'input-error': hasError(errors, ['initEmpty', 'initNaN'])})}
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
              {'player-up-next': nextTurns === 1},
              {'player-up-not': character.hp <= 0})}>
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
