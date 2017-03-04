import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {hasError} from 'utils/errors';
import Tag from 'components/Tag';
import DamageModifier from 'components/DamageModifier';

import backImg from 'images/back.svg';

export default class CombatActions extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    combat: React.PropTypes.object.isRequired,
    isUpNow: React.PropTypes.bool.isRequired,
    updateCombat: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      action: {targets: [], damageTotal: 0},
      errors: [],
      step: 0
    };
  }

  getActionMessage = (action, missed) => {
    const {character} = this.props;
    const isHeal = action.damageTotal < 0;
    let targetsString = '';
    let count = 0;
    _.each(action.targets, (target) => {
      if (count === 0) {
        targetsString += `${target.name}`;
      } else if (count === action.targets.length - 1) {
        targetsString += ` and ${target.name}`;
      } else {
        targetsString += `, ${target.name}`;
      }
      count++;
    });
    return `${character.name} ${action.type === 0
      ? 'attacked' : isHeal ? 'healed' : 'cast a spell on'} ${targetsString} ${missed
      ? action.type === 0 ? 'but missed!' : 'but they resisted!' : `for ${action.damageTotal >= 0
      ? action.damageTotal : action.damageTotal * -1} ${isHeal ? 'points' : 'damage'}!`}`;
  }

  handleAttack = () => {
    const {action, step} = this.state;
    const nextStep = step + 1;
    this.setState({action: {...action, type: 0}, step: nextStep});
  }

  handleCastSpell = () => {
    const {action, step} = this.state;
    const nextStep = step + 1;
    this.setState({action: {...action, type: 1}, step: nextStep});
  }

  handleSelectTarget = (target) => {
    return (e) => {
      e.preventDefault();
      const {action} = this.state;
      if (!this.getTarget(action.targets, target)) {
        action.targets.push({...target});
      } else {
        _.remove(action.targets, (t) => {
          return t.id === target.id;
        });
      }
      this.setState({action, errors: []});
    };
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

  handleDamage = (target) => {
    const {action} = this.state;
    _.each(action.targets, (t) => {
      if (t.name === target.name) {
        t.damage = target.damage;
      }
    });
    this.setState({action});
  }

  handleDamageTotal = () => {
    const {action} = this.state;
    if (this.validateAction()) {
      const damageTotal = parseInt(this.refs.damageTotal.value, 10);
      this.setState({action: {...action, damageTotal}});
    }
  }

  handleToggleHoldAction = () => {
    const {character, updateCombat} = this.props;
    character.isHoldingAction = !character.isHoldingAction;
    updateCombat();
  }

  handleNextStep = () => {
    if (this.state.step === 1) {
      if (this.validateTargets()) {
        this.setState({step: this.state.step + 1});
      }
    } else {
      this.setState({step: this.state.step + 1});
    }
  }

  handleBackStep = () => {
    this.setState({step: this.state.step - 1});
  }

  handleMiss = () => {
    const {action} = this.state;
    _.each(action.targets, (t) => {
      t.damage = 0;
    });
    action.message = this.getActionMessage(action, true);
    this.executeAction(action);
    this.setState({action: {targets: []}, step: 0});
  }

  handleMakeAction = () => {
    const {action} = this.state;
    if (this.validateAction()) {
      if (action.type === 1) {
        if (this.refs.heal.checked) {action.damageTotal *= -1;}
      }
      action.message = this.getActionMessage(action);
      this.executeAction(action);
      this.setState({action: {targets: []}, step: 0});
    }
  }

  executeAction = (action) => {
    const {combat, updateCombat} = this.props;
    _.each(action.targets, (t) => {
      const target = this.getTarget(combat.charactersInCombat, t);
      target.hp -= t.damage * (action.damageTotal > 0 ? 1 : -1);
    });
    if (combat.undoIndex > 0) {
      combat.actions.splice(0, combat.undoIndex);
      combat.undoIndex = 0;
    }
    combat.actions.splice(0, 0, action);
    updateCombat();
  }

  validateAction = () => {
    const errors = [];
    const damageTotal = this.refs.damageTotal.value;

    if (_.isEmpty(damageTotal)) {
      errors.push('damageTotalEmpty');
    } else if (!/^[0-9]\d*$/.test(damageTotal)) {
      errors.push('damageTotalNaN');
    }

    this.setState({errors});
    return (!errors.length);
  }

  validateTargets = () => {
    const errors = [];
    const {targets} = this.state.action;

    if (_.isEmpty(targets)) {
      errors.push('targetsEmpty');
    }

    this.setState({errors});
    return (!errors.length);
  }

  render() {
    const {action, errors, step} = this.state;
    const {character, combat, isUpNow} = this.props;

    return (
      <div>
        {step === 0 &&
          <div className="actions actions-dm-row">
            {!character.isNPC && <div className="page-subtitle">Combat actions:</div>}
            {!character.isHoldingAction &&
              <button
                className={
                  classNames('btn', 'btn-standard-width', {'btn-action': !character.isLocked || character.isNPC},
                  {'btn-disabled': character.isLocked && !character.isNPC})}
                disabled={character.isLocked && !character.isNPC}
                onClick={this.handleAttack}>Attack</button>
            }
            {!character.isHoldingAction &&
              <button
                className={
                  classNames('btn', 'btn-standard-width', {'btn-action': !character.isLocked || character.isNPC},
                  {'btn-disabled': character.isLocked && !character.isNPC})}
                disabled={character.isLocked && !character.isNPC}
                onClick={this.handleCastSpell}>Cast spell</button>
            }
            {(character.isHoldingAction || isUpNow) &&
              <button
                className={
                  classNames('btn', 'btn-standard-width', {'btn-action': !character.isLocked || character.isNPC},
                  {'btn-disabled': character.isLocked && !character.isNPC})}
                disabled={character.isLocked && !character.isNPC}
                onClick={this.handleToggleHoldAction}>{character.isHoldingAction ? 'Use action' : 'Hold action'}</button>
            }
          </div>
        }
        {step === 1 &&
          <div className="actions actions-dm-column">
            <div className="page-subtitle">
              <button className="btn-back pull-left" onClick={this.handleBackStep}><img src={backImg} /></button>
              <div>Choose target(s):</div>
            </div>
            {hasError(errors, ['targetsEmpty']) && <div className="alert alert-error">Choose at least one target</div>}
            {combat.charactersInCombat.filter((c) => {
              return !c.isRemoved;
            }).sort((a, b) => {
              const x = a.isNPC;
              const y = b.isNPC;
              return ((x && !y) ? -1 : ((!x && y) ? 1 : 0));
            }).map((c, i) => {
              return (
                <div
                  key={i}
                  className={classNames(
                    'target',
                    {'target-selected': this.getTarget(action.targets, c)},
                    {'target-error': hasError(errors, ['targetsEmpty'])})}
                  onClick={this.handleSelectTarget(c)}>
                  {c.isNPC && <div className="name-card--tag"><Tag type="npc" /></div>}
                  <div className="name-card--title">{c.name}</div>
                </div>
              );
            })}
            <button className="btn btn-action" onClick={this.handleNextStep}>Continue</button>
          </div>
        }
        {step === 2 &&
          <div className="actions actions-dm-column">
            <div className="page-subtitle">
              <button className="btn-back pull-left" onClick={this.handleBackStep}><img src={backImg} /></button>
              {action.type === 0 ? 'Roll to hit:' : 'Roll for success:'}
            </div>
            <div className="attack-container">
              <button
                className="btn btn-choose"
                onClick={this.handleNextStep}>{action.type === 0 ? 'Hit' : 'Success'}</button>
              <button
                className="btn btn-delete"
                onClick={this.handleMiss}>{action.type === 0 ? 'Miss' : 'Resisted'}</button>
            </div>
          </div>
        }
        {step === 3 &&
          <div className="actions actions-dm-column">
            <div className="page-subtitle">
              <button className="btn-back pull-left" onClick={this.handleBackStep}><img src={backImg} /></button>
              Enter damage:
            </div>
            {hasError(errors, ['damageTotalEmpty']) && <div className="alert alert-error">Enter damage</div>}
            {hasError(errors, ['damageTotalNaN']) && <div className="alert alert-error">Damage must be a number</div>}
            <div className="attack-container form-field">
              <input
                className={classNames('total-damage', {'input-error': hasError(errors, ['damageTotalEmpty', 'damageTotalNaN'])})}
                defaultValue={action.damageTotal}
                placeholder="integer"
                type="text"
                ref="damageTotal"
                onChange={this.handleDamageTotal} />
            </div>
            {action.type === 1 &&
              <div className="attack-container form-field">
                <label>
                  <input
                    type="checkbox" ref="heal" />
                Heal</label>
              </div>
            }
            {action.targets &&
              action.targets.map((t, i) => {
                return (
                  <DamageModifier key={i} target={t} damageTotal={action.damageTotal || 0} onDamageChange={this.handleDamage} />
                );
              })
            }
            <button className="btn btn-action" onClick={this.handleMakeAction}>Finish</button>
          </div>
        }
      </div>
    );
  }
}
