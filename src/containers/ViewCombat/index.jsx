import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import ViewCharacter from 'components/ViewCharacter';
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
      const currentInit = c.init;
      if (!c.isRemoved && currentInit < lowestInit) {lowestInit = currentInit;}
    });
    return lowestInit;
  }

  render() {
    const {combat} = this.props;
    const lowestInit = this.getLowestInit();
    const charactersNotRemoved = combat.charactersInCombat.filter((c) => {
      return !c.isRemoved;
    });

    return (
      <div className="page page-view">
        <div className="page-content page-content--dm-combat">
          <div className="name-card--container">
            <div className="page-subtitle center">Up next</div>
            <div className="scroll scroll-view">
              {combat.charactersInCombat.length > 0
                ? charactersNotRemoved.map((c, i) => {
                  return (
                    <div key={i}>
                      <NameCard
                        started={combat.isStarted}
                        isUpNow={i === 0}
                        isUpNext={i === 1}
                        isSelected={false}
                        character={c}
                        view={true} />
                      {combat.isStarted && c.init === lowestInit &&
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
          </div>
          <div className="combat-character--container">
            <div className="combat-name">{combat.name}</div>
            <div className="combat-round right-align">{`Round ${combat.rounds}\u00A0\u00A0|\u00A0\u00A0Turn ${combat.turns}`}</div>
            <div className="scroll scroll-view">
              <div className="combat-info">
                <div>NPCs</div>
              </div>
              <div className="view-character--container">
                {combat.charactersInCombat &&
                  combat.charactersInCombat.filter((c) => {
                    return !c.isRemoved && c.isNPC;
                  }).sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {return -1;}
                    if (nameA > nameB) {return 1;}
                    return 0;
                  }).map((c, i) => {
                    return (
                      <div key={i} className="view-character">
                        <ViewCharacter
                          character={c}
                          started={combat.isStarted}
                          isUpNow={charactersNotRemoved.indexOf(c) === 0}
                          isUpNext={charactersNotRemoved.indexOf(c) === 1} />
                      </div>
                    );
                  })
                }
              </div>
              <div className="combat-info">Players</div>
              <div className="view-character--container">
                {combat.charactersInCombat &&
                  combat.charactersInCombat.filter((c) => {
                    return !c.isRemoved && !c.isNPC;
                  }).sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) {return -1;}
                    if (nameA > nameB) {return 1;}
                    return 0;
                  }).map((c, i) => {
                    return (
                      <div key={i} className="view-character">
                        <ViewCharacter
                          character={c}
                          started={combat.isStarted}
                          isUpNow={charactersNotRemoved.indexOf(c) === 0}
                          isUpNext={charactersNotRemoved.indexOf(c) === 1} />
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
          <div className="turn-history--container">
            <div className="page-subtitle center">Turn history</div>
            {combat.actions.map((a, i) => {
              if (i >= combat.undoIndex && a.type !== 3 && a.type !== 2) {
                return (
                  <div key={i} className="turn-history--action">{a.message}</div>
                );
              }
              return true;
            })}
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
