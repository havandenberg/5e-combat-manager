import React from 'react';
import classNames from 'classnames';

export default class StatBubble extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    size: React.PropTypes.string
  }

  render() {
    const {character, size} = this.props;

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
          <span className="stat-bubble--text">{character.hp}</span>
        </div>
        <div className={classNames(
          'stat-bubble',
          'stat-bubble--ac',
          'circle',
          {'stat-bubble--large': size === 'large'},
          {'stat-bubble--med': size === 'med'},
          {'stat-bubble--small': size === 'small'})}>
          <span className="stat-bubble--label">AC</span>
          <span className="stat-bubble--text">{character.ac}</span>
        </div>
        {character.init &&
          <div className={classNames(
            'stat-bubble',
            'stat-bubble--init',
            'circle',
            {'stat-bubble--large': size === 'large'},
            {'stat-bubble--med': size === 'med'},
            {'stat-bubble--small': size === 'small'})}>
            <span className="stat-bubble--label">Initiative</span>
            <span className="character-stats--text">{character.init}</span>
          </div>
        }
      </div>
    );
  }
}
