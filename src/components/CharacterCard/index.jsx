import React from 'react';
import classNames from 'classnames';
import StatBubble from 'components/StatBubble';

export default class CharacterCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    selectable: React.PropTypes.bool
  }

  render() {
    const {character, selectable} = this.props;

    return (
      <div className={classNames('character-card', {'character-card--selectable': selectable})}>
        {character.imageURL && <div className="character-card--avatar"><img src={character.imageURL} /></div>}
        <div className="character-card--text">
          <div className="character-card--name center">{character.name}</div>
          <div className="character-card--field">Race: {character.race}</div>
          <div className="character-card--field">Class: {character.klass}</div>
          <StatBubble character={character} size="med" />
        </div>
      </div>
    );
  }
}
