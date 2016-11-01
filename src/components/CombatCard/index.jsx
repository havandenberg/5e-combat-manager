import React from 'react';

export default class CombatCard extends React.Component {
  static propTypes = {
    combat: React.PropTypes.object.isRequired
  }

  render() {
    const {combat} = this.props;

    return (
      <div className="combat-card">
        <div className="combat-card--text">
          <div className="combat-card--name center">{combat.name}</div>
          <div className="combat-card--field">{combat.description}</div>
          <div className="combat-card--field">Players:</div>
          <div className="combat-card--field">NPCs:</div>
        </div>
      </div>
    );
  }
}
