import React from 'react';
import {connect} from 'react-redux';
import StatBubble from 'components/StatBubble';

import * as combatActions from 'reducers/combat';

class CombatCharacter extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    combat: React.PropTypes.object.isRequired,
    isDM: React.PropTypes.bool.isRequired,
    key: React.PropTypes.number,
    updateCombat: React.PropTypes.func.isRequired,
    view: React.PropTypes.bool
  }

  render() {
    const {character, isDM, view} = this.props;

    return (
      <div className="combat-character">
        <div className="inner-one">
          {character.imageURL &&
            <div className="inner-one--avatar center">
              <img src={character.imageURL} />
            </div>
          }
          <div className="card-text card-field">
            <div className="card-name center">{character.name}</div>
            <div className="card-field">
              <div>Race: {character.race}</div>
              <div>Class: {character.klass}</div>
            </div>
            <div className="card-field bubbles">
              <StatBubble character={character} size="med" isDM={isDM} />
            </div>
          </div>
        </div>
        {character.isNPC && !view &&
          <div className="inner-two">
            <button className="btn btn-action" onClick={this.handleAttack}>Attack</button>
            <button className="btn btn-action" onClick={this.handleCastSpell}>Cast spell</button>
          </div>
        }
      </div>
    );
  }
}

export default connect((state) => {
  return {
    isDM: state.auth.get('isDM')
  };
}, {
  updateCombat: combatActions.startUpdateCombat
})(CombatCharacter);
