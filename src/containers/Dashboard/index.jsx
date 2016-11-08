import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import * as combatActions from 'reducers/combat';

import CharacterCard from 'components/CharacterCard';
import CombatCard from 'components/CombatCard';

class Dashboard extends React.Component {
  static propTypes = {
    characters: React.PropTypes.object.isRequired,
    combats: React.PropTypes.object.isRequired,
    isDM: React.PropTypes.bool,
    uid: React.PropTypes.string,
    updateCombat: React.PropTypes.func.isRequired
  }

  getCombatIndex = (combat) => {
    const {combats} = this.props;
    let index = 0;
    combats.map((c) => {
      if (combat.id === c.id) {return;}
      index++;
    });
    return index;
  }

  getParsedCombats = () => {
    const {combats, isDM} = this.props;
    return isDM ? combats : combats.filter((c) => {
      return c.isActive;
    });
  }

  hasCharacterInCombat = (c) => {
    let result = '';
    _.each(c.charactersInCombat, (char) => {
      if (char.user === this.props.uid) {
        result = char.name;
      }
    });
    return result;
  }

  render() {
    const {characters, isDM, updateCombat} = this.props;
    const parsedCombats = this.getParsedCombats();

    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title vcenter center">{`${isDM ? 'DM ' : ''}Dashboard`}</div>
        </div>
        <div className="page-content">
          <div className="page-subtitle">{`${isDM ? 'Saved' : 'Active'} combats`}</div>
          <div className="card-container">
            {!parsedCombats.isEmpty()
              ? parsedCombats.map((c, i) => {
                return (
                  <div key={i} className="card-wrapper">
                    <CombatCard
                      characterName={isDM ? '' : this.hasCharacterInCombat(c)}
                      combat={c}
                      index={this.getCombatIndex(c)}
                      isDM={isDM}
                      updateCombat={updateCombat} />
                  </div>
                );
              })
              : <div className="combats-empty center">{`No ${isDM ? 'saved' : 'active'} combats`}</div>
            }
          </div>
          {isDM && <div className="form-field center">
            <Link to="/create-combat"><button className="btn btn-action full-width">Create new combat</button></Link>
          </div>}
          <hr className="hr" />
          <div className="page-subtitle">{`${isDM ? 'NPCs' : 'My characters'}`}</div>
          <div className="card-container">
            {!characters.isEmpty()
              ? characters.map((c, i) => {
                return (
                    <div key={i} className="card-wrapper">
                      <Link className="no-decoration" to={`/edit-character/${characters.indexOf(c)}`}>
                        <CharacterCard character={c} isDM={isDM} />
                      </Link>
                    </div>
                );
              })
              : <div className="combats-empty center">No characters</div>
            }
          </div>
          <div className="form-field center">
            <Link to="/create-character"><button className="btn btn-action full-width">Create new character</button></Link>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    characters: state.characters,
    combats: state.combats,
    isDM: state.auth.get('isDM'),
    uid: state.auth.get('uid')
  };
}, {
  updateCombat: combatActions.startUpdateCombat
})(Dashboard);
