import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import StatBubble from 'components/StatBubble';

import * as combatActions from 'reducers/combat';

import backImg from 'images/back.svg';

class PlayerCombat extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    combat: React.PropTypes.object.isRequired,
    combatIndex: React.PropTypes.string.isRequired,
    updateCombat: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      action: {}
    };
  }

  handleEnterInitiative = () => {
    this.props.character.init = this.refs.init.value;
    this.updateCombat();
  }

  updateCombat = () => {
    const {combat, combatIndex, updateCombat} = this.props;
    updateCombat(combat.id, combat, `/player-combat/${combatIndex}`);
  }

  render() {
    const {character, combat} = this.props;

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
            {!character.init
              ? <div className="enter-initiative center">
                <div className="form-field">
                  <input
                    placeholder="1-20"
                    type="text"
                    ref="init" />
                </div>
                <button className="btn btn-action" onClick={this.handleEnterInitiative}>Enter initiative</button>
              </div>
              : <div className="combat-content">
                <StatBubble character={character} size="large" />
                <div className="actions">
                  <div className="page-subtitle">Combat actions:</div>
                  <button className="btn btn-action" onClick={this.handleAttack}>Attack</button>
                  <button className="btn btn-action" onClick={this.handleCastSpell}>Cast spell</button>
                  <button className="btn btn-action" onClick={this.handleHoldAction}>Hold action</button>
                </div>
              </div>
            }
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
    combatIndex
  };
}, {
  updateCombat: combatActions.startUpdateCombat
})(PlayerCombat);
