import React from 'react';
import StatBubble from 'components/StatBubble';

export default class ViewCharacter extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired
  }

  getQuantity = () => {
    return this.refs.quantity.value;
  }

  render() {
    const {character} = this.props;

    return (
      <div className="card card-space--small">
        {character.imageURL &&
          <div className="card-avatar card-avatar--view">
            <img src={character.imageURL} />
          </div>}
        <div className="view-character--name center">{character.name}</div>
        <div className="card-field">
          <div className="view-character--text">Race: {character.race}</div>
          <div className="view-character--text">Class: {character.klass}</div>
        </div>
        <StatBubble character={character} size="small" isView={true} />
      </div>
    );
  }
}
