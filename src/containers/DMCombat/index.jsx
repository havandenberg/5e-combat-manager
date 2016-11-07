import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import CombatCharacter from 'components/CombatCharacter';
import NameCard from 'components/NameCard';

import * as combatActions from 'reducers/combat';

import backImg from 'images/back.svg';
import settingsImg from 'images/settings.svg';

class DMCombat extends React.Component {
  static propTypes = {
    combat: React.PropTypes.object.isRequired,
    combatIndex: React.PropTypes.string.isRequired,
    updateCombat: React.PropTypes.func.isRequired
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

  getRemovedCharacters = () => {
    const {combat} = this.props;
    let count = 0;
    _.each(combat.charactersInCombat, (c) => {
      if (c.isRemoved) {count++;}
    });
    return count;
  }

  handleAdvanceTurn = () => {
    const {combat} = this.props;
    combat.currentTurn++;
    const index = combat.charactersInCombat.length - 1 - this.getRemovedCharacters();
    const temp = combat.charactersInCombat.splice(0, 1);
    combat.charactersInCombat.splice(index, 0, temp[0]);
    this.updateCombat();
  }

  handleStartCombat = () => {
    const {combat} = this.props;
    combat.isStarted = !combat.isStarted;

    if (combat.isStarted) {
      this.sortByInitiative();
      _.times(combat.currentTurn, () => {
        const index = combat.charactersInCombat.length - 1 - this.getRemovedCharacters();
        const temp = combat.charactersInCombat.splice(0, 1);
        combat.charactersInCombat.splice(index, 0, temp[0]);
      });
    } else {
      this.sortByIsNPC();
    }

    this.updateCombat();
  }

  readyToStart = () => {
    const {combat} = this.props;
    let result = true;
    _.each(combat.charactersInCombat, (c) => {
      if (!c.isRemoved && !c.init) {result = false;}
    });
    return result;
  }

  sortByInitiative = () => {
    const {combat} = this.props;
    combat.charactersInCombat.sort((a, b) => {
      const x = parseInt(a.init, 10);
      const y = parseInt(b.init, 10);
      if (a.isRemoved && !b.isRemoved) {return 1;}
      if (!a.isRemoved && b.isRemoved) {return -1;}
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }

  sortByIsNPC = () => {
    this.props.combat.charactersInCombat.sort((a, b) => {
      const x = a.isNPC;
      const y = b.isNPC;
      return ((x && !y) ? -1 : ((!x && y) ? 1 : 0));
    });
  }

  updateCombat = () => {
    const {combat, updateCombat} = this.props;
    updateCombat(combat.id, combat, '#');
  }

  render() {
    const {combat, combatIndex} = this.props;
    const lowestInit = this.getLowestInit();
    if (combat.isStarted && !this.readyToStart()) {
      this.handleStartCombat();
    }

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/dashboard"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          <div className="page-title vcenter center">{combat.name}</div>
          <div className="page-subtitle vcenter center">{combat.description}</div>
          <Link className="no-decoration btn-settings" to={`/edit-combat/${combatIndex}`}>
            <img src={settingsImg} />
          </Link>
        </div>
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
            <div className="dm-actions">
              {combat.isStarted
                ? <button
                  className="btn btn-advance-turn"
                  disabled={!combat.isStarted}
                  onClick={this.handleAdvanceTurn}>
                  Advance turn
                </button>
                : <button
                  className={classNames(
                    'btn',
                    {'btn-choose': !combat.isStarted && this.readyToStart()},
                    {'btn-disabled': !combat.isStarted && !this.readyToStart()})}
                  onClick={this.handleStartCombat}
                  disabled={!combat.isStarted && !this.readyToStart()}>
                  {combat.isStarted ? 'End combat' : 'Start combat'}
                </button>
              }
            </div>
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
                      updateCombat={this.updateCombat} />
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
}, {
  updateCombat: combatActions.startUpdateCombat
})(DMCombat);
