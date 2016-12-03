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
import eyeImg from 'images/eye.svg';
import undoImg from 'images/undo.svg';
import undoDisabledImg from 'images/undo-disabled.svg';
import redoImg from 'images/redo.svg';
import redoDisabledImg from 'images/redo-disabled.svg';

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
      const currentInit = c.init;
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

  getTarget = (array, char) => {
    let result = false;

    _.each(array, (c) => {
      if (c.id === char.id && c.copy === char.copy) {
        result = c;
      }
    });

    return result;
  }

  handleAdvanceTurn = () => {
    const {combat} = this.props;
    const index = combat.charactersInCombat.length - 1 - this.getRemovedCharacters();
    const temp = combat.charactersInCombat.splice(0, 1);
    combat.charactersInCombat.splice(index, 0, temp[0]);
    if (temp[0].init === this.getLowestInit()) {
      combat.actions.splice(0, 0, {type: 3, round: true, lastTurns: combat.turns});
      combat.rounds++;
      combat.turns = 1;
      _.each(combat.charactersInCombat, (c) => {
        if (!c.isRemoved) {c.isHoldingAction = false;}
      });
    } else {
      combat.turns++;
      combat.actions.splice(0, 0, {type: 3});
    }
    this.updateCombat();
  }

  handleStartCombat = () => {
    const {combat} = this.props;
    combat.isStarted = !combat.isStarted;

    if (combat.isStarted) {
      this.sortByInitiative();
      _.times(combat.turns, () => {
        const index = combat.charactersInCombat.length - 1 - this.getRemovedCharacters();
        const temp = combat.charactersInCombat.splice(0, 1);
        combat.charactersInCombat.splice(index, 0, temp[0]);
      });
    } else {
      this.sortByIsNPC();
    }

    this.updateCombat();
  }

  handleUndo = () => {
    const {combat} = this.props;

    if (combat.undoIndex < combat.actions.length - 1) {
      const action = combat.actions[combat.undoIndex];
      if (action.type === 0 || action.type === 1) {
        _.each(action.targets, (t) => {
          const target = this.getTarget(combat.charactersInCombat, t);
          target.hp += t.damage;
        });
      } else if (action.type === 2) {
        this.getTarget(combat.charactersInCombat, action.target).isHoldingAction = false;
      } else if (action.type === 3) {
        const index = combat.charactersInCombat.length - 1 - this.getRemovedCharacters();
        const temp = combat.charactersInCombat.splice(index, 1);
        combat.charactersInCombat.splice(0, 0, temp[0]);
        if (action.round) {
          combat.rounds--;
          combat.turns = action.lastTurns;
        } else {
          combat.turns--;
        }
      }
      combat.undoIndex++;
      this.updateCombat();
    }
  }

  handleRedo = () => {
    const {combat} = this.props;

    if (combat.undoIndex !== 0) {
      const action = combat.actions[combat.undoIndex - 1];
      if (action.type === 0 || action.type === 1) {
        _.each(action.targets, (t) => {
          const target = this.getTarget(combat.charactersInCombat, t);
          target.hp -= t.damage;
        });
      } else if (action.type === 2) {
        this.getTarget(combat.charactersInCombat, action.target).isHoldingAction = true;
      } else if (action.type === 3) {
        const index = combat.charactersInCombat.length - 1 - this.getRemovedCharacters();
        const temp = combat.charactersInCombat.splice(0, 1);
        combat.charactersInCombat.splice(index, 0, temp[0]);
        if (action.round) {
          combat.rounds++;
          combat.turns = 1;
        } else {
          combat.turns++;
        }
      }
      combat.undoIndex--;
      this.updateCombat();
    }
  }

  handleSelectCharacter = (c) => {
    return (e) => {
      if (e) {e.preventDefault();}
      this.refs.characterScroll.scrollTop = this.refs[c].offsetTop - 130;
    };
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
      const x = a.init;
      const y = b.init;
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
          <div className="dm-combat--tag-container">
            <div className="dm-combat--tag">{`Round ${combat.rounds}\u00A0\u00A0|\u00A0\u00A0Turn ${combat.turns}`}</div>
            <Link className="no-decoration circle dm-combat--tag-view" to={`/view-combat/${combatIndex}`}>
              <img src={eyeImg} />
            </Link>
            <Link className="no-decoration dm-combat--tag" to={`/edit-combat/${combatIndex}`}>
              <img src={settingsImg} />
            </Link>
          </div>
        </div>
        <div className="page-content page-content--dm-combat">
          <div className="name-card--container">
            <div className="page-subtitle center">Up next</div>
            <div className="scroll scroll-dm-combat">
              {combat.charactersInCombat.length > 0
                ? combat.charactersInCombat.filter((c) => {
                  return !c.isRemoved;
                }).map((c, i) => {
                  return (
                    <div key={i}>
                      <NameCard
                        started={combat.isStarted}
                        updateCombat={this.updateCombat}
                        isUpNow={i === 0}
                        isUpNext={i === 1}
                        isSelected={false}
                        character={c}
                        onSelectCharacter={this.handleSelectCharacter(`char${i}`)} />
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
                    {'btn-choose btn-choose--start': !combat.isStarted && this.readyToStart()},
                    {'btn-disabled': !combat.isStarted && !this.readyToStart()})}
                  onClick={this.handleStartCombat}
                  disabled={!combat.isStarted && !this.readyToStart()}>
                  {combat.isStarted ? 'End combat' : 'Start combat'}
                </button>
              }
              <div className="undo-redo">
                <img src={combat.undoIndex < combat.actions.length - 1 ? undoImg : undoDisabledImg} onClick={this.handleUndo} />
                <img src={combat.undoIndex === 0 ? redoDisabledImg : redoImg} onClick={this.handleRedo} />
              </div>
            </div>
            <div className="scroll scroll-dm-combat" ref="characterScroll">
              {combat.charactersInCombat
                ? combat.charactersInCombat.filter((c) => {
                  return !c.isRemoved;
                }).map((c, i) => {
                  return (
                    <div ref={`char${i}`} key={i}>
                      <CombatCharacter
                        character={c}
                        combat={combat}
                        isDM={true}
                        updateCombat={this.updateCombat} />
                      {combat.isStarted && c.init === lowestInit &&
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
