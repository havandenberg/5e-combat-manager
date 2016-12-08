import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Tag from 'components/Tag';
import {hasError} from 'utils/errors';

import lockedImg from 'images/locked.svg';
import unlockedImg from 'images/unlocked.svg';
import lockedWhiteImg from 'images/locked-white.svg';
import unlockedWhiteImg from 'images/unlocked-white.svg';

export default class NameCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    isSelected: React.PropTypes.bool,
    isUpNext: React.PropTypes.bool,
    isUpNow: React.PropTypes.bool,
    started: React.PropTypes.bool,
    updateCombat: React.PropTypes.func,
    view: React.PropTypes.bool,
    onSelectCharacter: React.PropTypes.func
  }

  constructor() {
    super();

    this.state = {
      errors: [],
      isHover: false
    };
  }

  handleSelectCharacter = () => {
    const {onSelectCharacter, view} = this.props;
    if (!view) {onSelectCharacter();}
  }

  handleEnterInitiative = () => {
    if (this.validate()) {
      this.props.character.init = parseInt(this.refs.init.value, 10);
      this.props.updateCombat();
    }
  }

  handleMouseEnter = () => {
    this.setState({isHover: true});
  }

  handleMouseLeave = () => {
    this.setState({isHover: false});
  }

  handleToggleLockCharacter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {character, updateCombat} = this.props;
    character.isLocked = !character.isLocked;
    updateCombat();
  }

  validate = () => {
    const errors = [];
    const init = this.refs.init.value;

    if (_.isEmpty(init)) {
      errors.push('initEmpty');
    } else if (!/^[0-9]\d*$/.test(init)) {
      errors.push('initNaN');
    }

    this.setState({errors});
    return (!errors.length);
  }

  render() {
    const {character, isUpNext, isUpNow, isSelected, started, view} = this.props;
    const {errors, isHover} = this.state;

    return (
      <div
        className={classNames(
          'name-card',
          {'name-card--upnow': isUpNow && started},
          {'name-card--upnext': isUpNext && started},
          {'name-card--unc': character.hp <= 0},
          {'name-card--selected': isSelected},
          {'name-card--not-ready': !started && !character.init},
          {'name-card--ready': !started && character.init},
          {'name-card--hover': !view}
        )}
        onClick={this.handleSelectCharacter}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}>
        {character.isNPC
          ? <div className={classNames('name-card--tag', {'name-card--tag-init': !character.init})}><Tag type="npc" /></div>
          : !view && <div
            className={classNames('name-card--tag', {'name-card--tag-init': !character.init})}
            onClick={this.handleToggleLockCharacter}>
            <img src={character.isLocked
              ? isHover ? lockedWhiteImg : lockedImg
              : isHover ? unlockedWhiteImg : unlockedImg} />
          </div>
        }
        <div className={classNames('name-card--title', {'name-card--unc-text': character.hp <= 0})}>{character.name}</div>
        {character.isNPC && <div>
          {!view && !character.init &&
            <div className="enter-initial-stats--name-card center">
              <input
                className={classNames({'init-error': hasError(errors, ['initEmpty', 'initNaN'])})}
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
