import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import CombatCharacter from 'components/CombatCharacter';
import NameCard from 'components/NameCard';

import * as combatActions from 'reducers/combat';

import backImg from 'images/back.svg';

class DMCombat extends React.Component {
  static propTypes = {
    combat: React.PropTypes.object.isRequired,
    combatIndex: React.PropTypes.string.isRequired,
    updateCombat: React.PropTypes.func.isRequired
  }

  handleToggleStarted = () => {
    const {combat} = this.props;
    combat.isStarted = !combat.isStarted;

    if (combat.isStarted) {
      this.sortByInitiative();
    } else {
      this.sortByIsNPC();
    }

    this.updateCombat();
  }

  handleSelectCharacter = () => {

  }

  readyToStart = () => {
    const {combat} = this.props;
    let result = true;
    _.each(combat.charactersInCombat, (c) => {
      if (!c.init) {result = false;}
    });
    return result;
  }

  sortByInitiative = () => {
    this.props.combat.charactersInCombat.sort((a, b) => {
      const x = parseInt(a.init, 10);
      const y = parseInt(b.init, 10);
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
    const {combat} = this.props;
    let filteredCICCount = 0;

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/dashboard"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          <button
            className={classNames(
              'btn',
              'btn-toggle-start-combat',
              {'btn-choose': !combat.isStarted && this.readyToStart()},
              {'btn-delete': combat.isStarted},
              {'btn-disabled': !combat.isStarted && !this.readyToStart()})}
            onClick={this.handleToggleStarted}
            disabled={!combat.isStarted && !this.readyToStart()}>
            {combat.isStarted ? 'End combat' : 'Start combat'}
          </button>
          <div className="page-title vcenter center">{combat.name}</div>
          <div className="page-subtitle vcenter center">{combat.description}</div>
        </div>
        <div className="page-content page-content--dm-combat">
          <div className="name-card--container">
            <div className="page-subtitle center">Up next</div>
            {combat.charactersInCombat.length > 0
              ? combat.charactersInCombat.filter((c) => {
                if (!c.isRemoved) {filteredCICCount++;}
                return !c.isRemoved;
              }).map((c, i) => {
                return (
                  <div key={i}>
                    <NameCard
                      started={combat.isStarted}
                      updateCombat={this.updateCombat}
                      isSelected={false}
                      character={c}
                      onClick={this.handleSelectCharacter} />
                    {i === filteredCICCount - 1 &&
                      <div className="end-of-round end-of-round--name">
                        <div className="end-of-round--content">End of Round</div>
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
                      updateCombat={this.updateCombat} />
                    {i === filteredCICCount - 1 &&
                      <div className="end-of-round end-of-round--card">
                        <div className="end-of-round--content">End of Round</div>
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
