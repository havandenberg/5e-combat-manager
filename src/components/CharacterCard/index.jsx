import React from 'react';

import avatarImg from 'images/avatar.png';

export default class CharacterCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired
  }

  render() {
    const {character} = this.props;

    return (
      <div className="character-card">
        <div className="character-card--avatar"><img src={avatarImg} /></div>
        <div className="character-card--text">
          <div className="character-card--name center">{character.name}</div>
          <div className="character-card--field">Race: {character.race}</div>
          <div className="character-card--field">Class: {character.class}</div>
        </div>
      </div>
    );
  }
}
