import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import CharacterCard from 'components/CharacterCard';

class PlayerDashboard extends React.Component {
  static propTypes = {
    characters: React.PropTypes.object,
    combatSessions: React.PropTypes.object
  }

  render() {
    const {characters, combatSessions} = this.props;

    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title vcenter center">Dashboard</div>
        </div>
        <div className="page-content">
          <div className="page-subtitle">Active combat sessions</div>
          {combatSessions &&
            (Object.keys(combatSessions).length === 0
            ? <div className="combat-sessions-empty center">No active combat sessions</div>
            : <div className="combat-container">
                {
                  combatSessions.map((c, i) => {
                    return (
                      // <CombatCard key={i} combat={c} />
                      <div key={i}>{`${c}`}</div>
                    );
                  })
                }
              </div>)
          }
          <hr className="hr" />
          <div className="page-subtitle">My characters</div>
          <div className="character-container">
            {
              characters.map((c, i) => {
                return (
                    <Link className="no-decoration" key={i} to={`/edit-character/${characters.indexOf(c)}`}>
                      <CharacterCard character={c} />
                    </Link>
                );
              })
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
    combatSessions: state.combatSessions || {}
  };
}, {})(PlayerDashboard);
