import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import CharacterCard from 'components/CharacterCard';
import CombatCard from 'components/CombatCard';

class Dashboard extends React.Component {
  static propTypes = {
    characters: React.PropTypes.object.isRequired,
    combats: React.PropTypes.object.isRequired,
    isDM: React.PropTypes.bool
  }

  render() {
    const {characters, combats, isDM} = this.props;

    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title vcenter center">{`${isDM ? 'DM ' : ''}Dashboard`}</div>
        </div>
        <div className="page-content">
          <div className="page-subtitle">{`${isDM ? 'Saved' : 'Active'} combats`}</div>
          <div className="card-container">
            {!combats.isEmpty()
              ? combats.map((c, i) => {
                return (
                    <div key={i} className="card-wrapper">
                      <CombatCard combat={c} index={i} />
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
                        <CharacterCard character={c} />
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
    isDM: state.auth.get('isDM')
  };
}, {})(Dashboard);
