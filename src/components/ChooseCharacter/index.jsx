import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as combatActions from 'reducers/combat';

import CharacterCard from 'components/CharacterCard';

import backImg from 'images/back.svg';

class ChooseCharacter extends React.Component {
  static propTypes = {
    characters: React.PropTypes.object.isRequired,
    combat: React.PropTypes.object.isRequired,
    combatIndex: React.PropTypes.string.isRequired,
    uid: React.PropTypes.string.isRequired,
    updateCombat: React.PropTypes.func.isRequired
  }

  handleChooseCharacter = (c) => {
    return (e) => {
      e.preventDefault();
      const {combat, combatIndex, updateCombat, uid} = this.props;
      c.isRemoved = false;
      c.user = uid;
      combat.charactersInCombat.push(c);
      updateCombat(combat.id, combat, `/player-combat/${combatIndex}`);
    };
  }

  render() {
    const {characters} = this.props;

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/dashboard"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          <div className="page-title vcenter center">Choose character</div>
        </div>
        <div className="page-content">
          <div className="card-container">
            {!characters.isEmpty()
              ? characters.map((c, i) => {
                return (
                    <div key={i} className="card-wrapper">
                      <CharacterCard character={c} isChoose={true} handleChooseCharacter={this.handleChooseCharacter(c)} />
                    </div>
                );
              })
              : <div className="combats-empty center">No characters</div>
            }
          </div>
          {characters.isEmpty() &&
            <Link className="no-decoration" to="/create-character">
              <button className="btn btn-action full-width">Create new character</button>
            </Link>
          }
        </div>
      </div>
    );
  }
}

export default connect((state, props) => {
  const {combatIndex} = props.params;
  const combat = state.combats.get(combatIndex);

  return {
    characters: state.characters,
    combat,
    combatIndex,
    uid: state.auth.get('uid')
  };
}, {
  updateCombat: combatActions.startUpdateCombat
})(ChooseCharacter);
