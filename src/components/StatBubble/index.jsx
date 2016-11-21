import React from 'react';
import classNames from 'classnames';

export default class StatBubble extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    isDM: React.PropTypes.bool,
    isEditable: React.PropTypes.bool,
    size: React.PropTypes.string,
    updateCombat: React.PropTypes.func
  }

  validate = (string) => {
    return /^[0-9]\d*$/.test(string) || string === '';
  }

  handleHPChange = () => {
    const {character, updateCombat} = this.props;
    const hp = this.refs.hp.value;
    if (this.validate(hp)) {
      character.hp = hp;
    }
    updateCombat();
  }

  handleACChange = () => {
    const {character, updateCombat} = this.props;
    const ac = this.refs.ac.value;
    if (this.validate(ac)) {
      character.ac = ac;
    }
    updateCombat();
  }

  handleInitChange = () => {
    const {character, updateCombat} = this.props;
    const init = this.refs.init.value;
    if (this.validate(init)) {
      character.init = init;
    }
    updateCombat();
  }

  render() {
    const {character, isDM, isEditable, size} = this.props;

    return (
      <div className="stat-bubble-container">
        <div className={classNames(
          'stat-bubble',
          'stat-bubble--hp',
          'circle',
          {'stat-bubble--large': size === 'large'},
          {'stat-bubble--med': size === 'med'},
          {'stat-bubble--small': size === 'small'})}>
          <span className="stat-bubble--label">HP</span>
          <span className="stat-bubble--text">
            {isEditable
              ? <input className="stats-input" value={character.hp} ref="hp" onChange={this.handleHPChange} />
              : (character.isNPC && !isDM) ? !character.isLocked ? character.hp : '???' : character.hp
            }
          </span>
        </div>
        <div className={classNames(
          'stat-bubble',
          'stat-bubble--ac',
          'circle',
          {'stat-bubble--large': size === 'large'},
          {'stat-bubble--med': size === 'med'},
          {'stat-bubble--small': size === 'small'})}>
          <span className="stat-bubble--label">AC</span>
          <span className="stat-bubble--text">
            {isEditable
              ? <input className="stats-input" value={character.ac} ref="ac" onChange={this.handleACChange} />
              : (character.isNPC && !isDM) ? !character.isLocked ? character.ac : '??' : character.ac
            }
          </span>
        </div>
        {character.init &&
          <div className={classNames(
            'stat-bubble',
            'stat-bubble--init',
            'circle',
            {'stat-bubble--large': size === 'large'},
            {'stat-bubble--med': size === 'med'},
            {'stat-bubble--small': size === 'small'})}>
            <span className="stat-bubble--label">IN</span>
            <span className="stat-bubble--text">
              {isEditable
                ? <input className="stats-input" value={character.init} ref="init" onChange={this.handleInitChange} />
                : (character.isNPC && !isDM) ? !character.isLocked ? character.init : '??' : character.init
              }
            </span>
          </div>
        }
      </div>
    );
  }
}
