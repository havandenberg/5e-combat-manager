import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {Link} from 'react-router';
import Tag from 'components/Tag';

import settingsImg from 'images/settings.svg';

export default class CombatCard extends React.Component {
  static propTypes = {
    combat: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired
  }

  getStats = () => {
    const {charactersInCombat} = this.props.combat;
    let npcs = 0;
    let players = 0;

    if (charactersInCombat) {
      _.each(charactersInCombat, (c) => {
        if (c.isNPC) {
          npcs++;
        } else {
          players++;
        }
      });
    }

    return {players, npcs};
  }

  render() {
    const {combat, index} = this.props;
    const stats = this.getStats();

    return (
      <div className="card card-combat">
        <div className="card-text card-field">
          <div className="card-name center">{combat.name}</div>
          <div className="card-field">
            <div>Created on: {moment.unix(combat.createdAt).format('MM/DD/YYYY')}</div>
            <div>Players: {stats.players}</div>
            <div>NPCs: {stats.npcs}</div>
          </div>
          <div className="card-field">{combat.description}</div>
        </div>
        <Link className="no-decoration btn-settings" to={`/edit-combat/${index}`}>
          <img src={settingsImg} />
        </Link>
        <div className="tag-combat-card">
          <Tag type={combat.isActive ? 'active' : 'inactive'} />
        </div>
        <Link className="center" to={`/combat/${index}`}><button className="btn btn-combat">Enter</button></Link>
      </div>
    );
  }
}
