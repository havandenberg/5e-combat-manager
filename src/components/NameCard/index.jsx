import React from 'react';
import classNames from 'classnames';
import Tag from 'components/Tag';

export default class NameCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    isSelected: React.PropTypes.bool,
    started: React.PropTypes.bool,
    updateCombat: React.PropTypes.func,
    onClick: React.PropTypes.func
  }

  handleClick = () => {
    this.props.onClick();
  }

  handleEnterInitiative = () => {
    this.props.character.init = this.refs.init.value;
    this.props.updateCombat();
  }

  render() {
    const {character, isSelected, started} = this.props;

    return (
      <div
        className={classNames(
          'name-card',
          {'name-card-selected': isSelected},
          {'name-card--not-ready': !started && !character.init},
          {'name-card--ready': !started && character.init}
        )}
        onClick={this.handleClick}>
        <div className="name-card--title">{character.name}</div>
        {character.isNPC && <div>
          <div className={classNames('name-card--tag', {'name-card--tag-init': !character.init})}><Tag type="npc" /></div>
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
