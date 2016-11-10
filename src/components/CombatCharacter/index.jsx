import React from 'react';
import StatBubble from 'components/StatBubble';
import CombatActions from 'components/CombatActions';

export default class CombatCharacter extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    combat: React.PropTypes.object.isRequired,
    isDM: React.PropTypes.bool.isRequired,
    key: React.PropTypes.number,
    updateCombat: React.PropTypes.func,
    view: React.PropTypes.bool
  }

  render() {
    const {character, combat, isDM, updateCombat, view} = this.props;

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
          <div className="dm-combat-content">
            <CombatActions character={character} combat={combat} isUpNow={true} updateCombat={updateCombat} />
          </div>
        }
      </div>
    );
  }
}
