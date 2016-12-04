import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Link} from 'react-router';

class CharacterSwitcher extends Component {
  static propTypes = {
    characters: PropTypes.object.isRequired,
    combat: PropTypes.object.isRequired,
    combatIndex: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired
  }

  isInCombat = (c) => {
    const {combat} = this.props;
    let result = false;
    _.each(combat.charactersInCombat, (char) => {
      if (c.id === char.id && !char.isRemoved) {result = true;}
    });
    return result;
  }

  isVisible = () => {
    const {characters} = this.props;
    return characters.filter((c) => {
      return this.isInCombat(c);
    }).size > 1;
  }

  render() {
    const {characters, combatIndex} = this.props;

    return (
      <div className="character-switcher">
        {!characters.isEmpty() && this.isVisible() &&
          characters.filter((c) => {
            return this.isInCombat(c);
          }).map((c, i) => {
            return (
              <div key={i}>
                {c.imageURL &&
                  <Link to={`/player-combat/${combatIndex}/${c.name}`}>
                    <img className="character" src={c.imageURL} />
                  </Link>}
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default connect((state) => {
  return {
    characters: state.characters,
    uid: state.auth.get('uid')
  };
})(CharacterSwitcher);
