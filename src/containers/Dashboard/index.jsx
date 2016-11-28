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

  constructor() {
    super();

    this.state = {
      isAdding: false,
      combat: null
    };
  }

  getCombatIndex = (combat) => {
    const {combats} = this.props;
    let index = 0;
    let stop = false;
    combats.map((c) => {
      if (combat.id === c.id) {stop = true;}
      if (!stop) {index++;}
    });
    return index;
  }

  getParsedCombats = () => {
    const {combats, isDM} = this.props;
    return isDM ? combats : combats.filter((c) => {
      return c.isActive;
    });
  }

  hasCharactersInCombat = (c) => {
    const result = [];
    _.each(c.charactersInCombat, (char) => {
      if (char.user === this.props.uid && !char.isRemoved) {
        result.push(char.name);
      }
    });
    return result;
  }

  handleChooseCharacter = (c) => {
    return (e) => {
      if (e) {e.preventDefault();}
      const {updateCombat, uid} = this.props;
      const {isAdding, combat} = this.state;
      if (isAdding) {
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
        updateCombat(combat.id, combat);
        this.setState({isAdding: false, combat: null});
      }
    };
  }

  handleToggleAdd = (combat) => {
    return (e) => {
      if (e) {e.preventDefault();}
      this.setState({isAdding: !this.state.isAdding, combat});
    };
  }

  render() {
    const {characters, isDM, updateCombat} = this.props;
    const {combat, isAdding} = this.state;
    const parsedCombats = this.getParsedCombats();

    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title vcenter center">{`${isDM ? 'DM ' : ''}Dashboard`}</div>
        </div>
        <div className="page-content scroll">
          <div className="page-subtitle">{`${isDM ? 'Saved' : 'Active'} combats`}</div>
          <div className="card-container">
            {!parsedCombats.isEmpty()
              ? parsedCombats.map((c, i) => {
                return (
                  <div key={i} className="card-wrapper">
                    <CombatCard
                      characterNames={isDM ? [] : this.hasCharactersInCombat(c)}
                      combat={c}
                      index={isDM ? i : this.getCombatIndex(c)}
                      isDM={isDM}
                      isAdding={isAdding && combat.id === c.id}
                      updateCombat={updateCombat}
                      onToggleAdd={this.handleToggleAdd(c)} />
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
                      {isAdding
                        ? <div onClick={this.handleChooseCharacter(c)}><CharacterCard character={c} isDM={isDM} /></div>
                        : <Link className="no-decoration" to={`/edit-character/${characters.indexOf(c)}`}>
                          <CharacterCard character={c} isDM={isDM} />
                        </Link>
                      }
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
