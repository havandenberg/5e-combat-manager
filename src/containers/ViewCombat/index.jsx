import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import CombatCharacter from 'components/CombatCharacter';
import NameCard from 'components/NameCard';

class ViewCombat extends React.Component {
  static propTypes = {
    combat: React.PropTypes.object.isRequired,
    combatIndex: React.PropTypes.string.isRequired
  }

  getLowestInit = () => {
    const {combat} = this.props;
    let lowestInit = 100000;
    _.each(combat.charactersInCombat, (c) => {
      const currentInit = parseInt(c.init, 10);
      if (!c.isRemoved && currentInit < lowestInit) {lowestInit = currentInit;}
    });
    return lowestInit;
  }

  render() {
    const {combat} = this.props;
    const lowestInit = this.getLowestInit();

    return (
      <div className="page">
        <div className="page-content page-content--dm-combat">
          <div className="name-card--container">
            <div className="page-subtitle center">Up next</div>
            {combat.charactersInCombat.length > 0
              ? combat.charactersInCombat.filter((c) => {
                return !c.isRemoved;
              }).map((c, i) => {
                return (
                  <div key={i}>
                    <NameCard
                      started={combat.isStarted}
                      updateCombat={this.updateCombat}
                      isInverted={i === 0}
                      isSelected={false}
                      character={c} />
                    {combat.isStarted && parseInt(c.init, 10) === lowestInit &&
                      <div className="end-of-round end-of-round--name">
                        <div className="end-of-round--line"></div>
                        <div className="end-of-round--text">End of Round</div>
                        <div className="end-of-round--line"></div>
                      </div>
                    }
                  </div>
                );
              })
              : <div className="combats-empty center">No characters</div>
            }
          </div>
          <div className="combat-character--container">
            {combat.charactersInCombat.length > 0
              ? combat.charactersInCombat.filter((c) => {
                return !c.isRemoved;
              }).map((c, i) => {
                return (
                  <div key={i}>
                    <CombatCharacter
                      character={c}
                      combat={combat}
                      key={i}
                      view={true} />
                    {combat.isStarted && parseInt(c.init, 10) === lowestInit &&
                      <div className="end-of-round end-of-round--card">
                        <div className="end-of-round--line"></div>
                        <div className="end-of-round--text">End of Round</div>
                        <div className="end-of-round--line"></div>
                      </div>
                    }
                  </div>
                );
              })
              : <div className="combats-empty center">No characters</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state, props) => {
  const {combatIndex} = props.params;
  const combat = state.combats.get(combatIndex);

  return {
    combat,
    combatIndex
  };
}, {})(ViewCombat);
