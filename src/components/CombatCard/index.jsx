import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {Link} from 'react-router';
import Tag from 'components/Tag';

import settingsImg from 'images/settings.svg';

export default class CombatCard extends React.Component {
  static propTypes = {
    characterName: React.PropTypes.string,
    combat: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    isDM: React.PropTypes.bool.isRequired
  }

  getStats = () => {
    const {charactersInCombat} = this.props.combat;
    let npcs = 0;
    let players = 0;

    if (charactersInCombat) {
      _.each(charactersInCombat, (c) => {
        if (!c.isRemoved) {
          if (c.user === 'FIZvJUfXSbMJj0D0BLpxR4s7Ow13') {
            npcs++;
          } else {
            players++;
          }
        }
      });
    }

    return {players, npcs};
  }

  render() {
    const {characterName, combat, index, isDM} = this.props;
    const stats = this.getStats();

    return (
      <div className="card card-choose">
        <div className="card-text card-field">
          <div className="card-name center">{combat.name}</div>
          {!isDM &&
            <div className="card-field"><strong>{characterName ? `Character: ${characterName}` : 'No character in combat'}</strong></div>
          }
          <div className="card-field">
            <div>Created on: {moment.unix(combat.createdAt).format('MM/DD/YYYY')}</div>
            <div>Players: {stats.players}</div>
            <div>NPCs: {stats.npcs}</div>
          </div>
          <div className="card-field">{combat.description}</div>
        </div>
        {isDM &&
          <div>
            <Link className="no-decoration btn-settings" to={`/edit-combat/${index}`}>
              <img src={settingsImg} />
            </Link>
            <div className="tag-combat-card">
              <Tag type={combat.isActive ? 'active' : 'inactive'} />
            </div>
          </div>
        }
        <Link className="center" to={isDM ? `/combat/${index}` : characterName ? `player-combat/${index}` : `choose-character/${index}`}>
          <button className="btn btn-choose">Enter</button>
        </Link>
      </div>
    );
  }
}
