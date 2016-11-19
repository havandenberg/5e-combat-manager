import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
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

  handleGoBack = () => {
    browserHistory.goBack();
  }

  handleChooseCharacter = (c) => {
    return (e) => {
      e.preventDefault();
      const {combat, combatIndex, updateCombat, uid} = this.props;
      let result = false;
      _.each(combat.charactersInCombat, (char) => {
        if (c.id === char.id) {
          char.isRemoved = false;
          result = true;
        }
      });
      if (!result) {
        c.isRemoved = false;
        c.user = uid;
        combat.charactersInCombat.push(c);
        combat.isStarted = false;
      }
      updateCombat(combat.id, combat, `/player-combat/${combatIndex}/${c.name}`);
    };
  }

  handleRemoveCharacter = (c) => {
    return (e) => {
      e.preventDefault();
      const {combat, updateCombat} = this.props;
      if (this.isInCombat(c)) {
        _.each(combat.charactersInCombat, (char) => {
          if (c.id === char.id) {char.isRemoved = true;}
        });
        updateCombat(combat.id, combat, '#');
      }
    };
  }

  isInCombat = (c) => {
    const {combat} = this.props;
    let result = false;
    _.each(combat.charactersInCombat, (char) => {
      if (c.id === char.id && !char.isRemoved) {result = true;}
    });
    return result;
  }

  render() {
    const {characters} = this.props;

    return (
      <div className="page">
        <div className="page-header">
          <button className="btn-back pull-left" onClick={this.handleGoBack}><img src={backImg} /></button>
          <div className="page-title vcenter center">Choose character</div>
        </div>
        <div className="page-content">
          <div className="card-container">
            {!characters.isEmpty()
              ? characters.map((c, i) => {
                return (
                    <div key={i} className="card-wrapper">
                      <CharacterCard
                        character={c}
                        isChoose={true}
                        isInCombat={this.isInCombat(c)}
                        handleChooseCharacter={this.handleChooseCharacter(c)}
                        handleRemoveCharacter={this.handleRemoveCharacter(c)} />
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
