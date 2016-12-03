import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';

export default class DeathSaves extends Component {
  static propTypes = {
    character: PropTypes.object.isRequired,
    updateCombat: PropTypes.func.isRequired
  }

  handleDeathSuccess = (number) => {
    return (e) => {
      e.preventDefault();
      const {character, updateCombat} = this.props;
      switch (number) {
      case 1:
        if (character.deathSuccs === 1) {
          character.deathSuccs = 0;
        } else {
          character.deathSuccs = 1;
        }
        break;
      case 2:
        if (character.deathSuccs === 2) {
          character.deathSuccs = 1;
        } else {
          character.deathSuccs = 2;
        }
        break;
      default:
        if (character.deathSuccs === 3) {
          character.deathSuccs = 2;
        } else {
          character.deathSuccs = 3;
        }
      }
      if (character.deathSuccs === 3) {character.hp = 1;}
      updateCombat();
    };
  }

  handleDeathFail = (number) => {
    return (e) => {
      e.preventDefault();
      const {character, updateCombat} = this.props;
      switch (number) {
      case 1:
        if (character.deathFails === 1) {
          character.deathFails = 0;
        } else {
          character.deathFails = 1;
        }
        break;
      case 2:
        if (character.deathFails === 2) {
          character.deathFails = 1;
        } else {
          character.deathFails = 2;
        }
        break;
      default:
        if (character.deathFails === 3) {
          character.deathFails = 2;
        } else {
          character.deathFails = 3;
        }
      }
      updateCombat();
    };
  }

  render() {
    const {character} = this.props;

    return (
      <div>
        <div className="death-saves-title">Death successes:</div>
        <div className="death-saves-container">
          <div
            className={classNames('save', {'save-success': character.deathSuccs > 0})}
            onClick={this.handleDeathSuccess(1)}></div>
          <div
            className={classNames('save', {'save-success': character.deathSuccs > 1})}
            onClick={this.handleDeathSuccess(2)}></div>
          <div
            className={classNames('save', {'save-success': character.deathSuccs > 2})}
            onClick={this.handleDeathSuccess(3)}></div>
        </div>
        <div className="death-saves-title">Death failures:</div>
        <div className="death-saves-container">
          <div
            className={classNames('save', {'save-fail': character.deathFails > 0})}
            onClick={this.handleDeathFail(1)}></div>
          <div
            className={classNames('save', {'save-fail': character.deathFails > 1})}
            onClick={this.handleDeathFail(2)}></div>
          <div
            className={classNames('save', {'save-fail': character.deathFails > 2})}
            onClick={this.handleDeathFail(3)}></div>
        </div>
      </div>
    );
  }
}
