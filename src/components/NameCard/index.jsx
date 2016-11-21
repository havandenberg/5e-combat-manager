import React from 'react';
import classNames from 'classnames';
import Tag from 'components/Tag';

import lockedImg from 'images/locked.svg';
import unlockedImg from 'images/unlocked.svg';

export default class NameCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    isSelected: React.PropTypes.bool,
    isUpNext: React.PropTypes.bool,
    isUpNow: React.PropTypes.bool,
    started: React.PropTypes.bool,
    updateCombat: React.PropTypes.func,
    view: React.PropTypes.bool
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
    const {character, isUpNext, isUpNow, isSelected, started, view} = this.props;

    return (
      <div
        className={classNames(
          'name-card',
          {'name-card--upnow': isUpNow && started},
          {'name-card--upnext': isUpNext && started},
          {'name-card--selected': isSelected},
          {'name-card--not-ready': !started && !character.init},
          {'name-card--ready': !started && character.init}
        )}
        onClick={this.handleSelectCharacter}>
        {character.isNPC
          ? <div className={classNames('name-card--tag', {'name-card--tag-init': !character.init})}><Tag type="npc" /></div>
          : !view && <div
            className={classNames('name-card--tag', {'name-card--tag-init': !character.init})}
            onClick={this.handleToggleLockCharacter}>
            <img src={character.isLocked
              ? lockedImg
              : unlockedImg} />
          </div>
        }
        <div className="name-card--title">{character.name}</div>
        {character.isNPC && <div>
          {!view && !character.init &&
            <div className="enter-initial-stats--name-card center">
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
