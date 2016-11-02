import React from 'react';
import classNames from 'classnames';
import StatBubble from 'components/StatBubble';

export default class CharacterCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    isSelected: React.PropTypes.bool,
    selectable: React.PropTypes.bool
  }

  render() {
    const {character, isSelected, selectable} = this.props;

    return (
      <div className={classNames('card',
        {'card-selectable': selectable},
        {'card-unselectable': !selectable},
        {'card-selected': isSelected})}>
        {character.imageURL && <div className="card-avatar"><img src={character.imageURL} /></div>}
        <div className="card-text">
          <div className="card-name center">{character.name}</div>
          <div className="card-field">
            <div>Race: {character.race}</div>
            <div>Class: {character.klass}</div>
          </div>
          <StatBubble character={character} size="med" />
        </div>
      </div>
    );
  }
}
