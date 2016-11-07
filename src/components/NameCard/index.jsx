import React from 'react';
import classNames from 'classnames';
import Tag from 'components/Tag';

import lockedImg from 'images/locked.svg';
import unlockedImg from 'images/unlocked.svg';
import lockedWhiteImg from 'images/locked-white.svg';
import unlockedWhiteImg from 'images/unlocked-white.svg';

export default class NameCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    isInverted: React.PropTypes.bool,
    isSelected: React.PropTypes.bool,
    started: React.PropTypes.bool,
    updateCombat: React.PropTypes.func
  }

  handleSelectCharacter = () => {

  }

  handleEnterInitiative = () => {
    this.props.character.init = this.refs.init.value;
    this.props.updateCombat();
  }

  handleToggleLockCharacter = () => {
    const {character, updateCombat} = this.props;
    character.isLocked = !character.isLocked;
    updateCombat();
  }

  render() {
    const {character, isInverted, isSelected, started} = this.props;

    return (
      <div
        className={classNames(
          'name-card',
          {'name-card--inverted': isInverted && started},
          {'name-card--selected': isSelected},
          {'name-card--not-ready': !started && !character.init},
          {'name-card--ready': !started && character.init}
        )}
        onClick={this.handleSelectCharacter}>
        {character.isNPC
          ? <div className={classNames('name-card--tag', {'name-card--tag-init': !character.init})}><Tag type="npc" /></div>
          : <div
            className={classNames('name-card--tag', {'name-card--tag-init': !character.init})}
            onClick={this.handleToggleLockCharacter}>
            <img src={character.isLocked ? isInverted ? lockedWhiteImg : lockedImg : isInverted ? unlockedWhiteImg : unlockedImg} />
          </div>
        }
        <div className="name-card--title">{character.name}</div>
        {character.isNPC && <div>
          {!character.init &&
            <div className="enter-initiative--name-card center">
              <input
                placeholder="initiative"
                type="text"
                ref="init" />
              <button className="btn btn-action" onClick={this.handleEnterInitiative}>Set</button>
            </div>
          }
        </div>}
      </div>
    );
  }
}
