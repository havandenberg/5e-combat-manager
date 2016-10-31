import React from 'react';
import StatBubble from 'components/StatBubble';

export default class CharacterCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired
  }

  render() {
    const {character} = this.props;

    return (
      <div className="character-card">
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
