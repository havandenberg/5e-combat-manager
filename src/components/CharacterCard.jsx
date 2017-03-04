import React from 'react';
import classNames from 'classnames';
import StatBubble from 'components/StatBubble';
import {getModifier} from 'utils/resources';

import detailsImg from 'images/details.svg';
import detailsSelectedImg from 'images/details-selected.svg';

export default class CharacterCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    isDM: React.PropTypes.bool,
    isEditCombat: React.PropTypes.bool,
    isSelected: React.PropTypes.bool,
    selectable: React.PropTypes.bool
  }

  constructor() {
    super();

    this.state = {
      isExpanded: false
    };
  }

  handleToggleDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({isExpanded: !this.state.isExpanded});
  }

  getQuantity = () => {
    return this.refs.quantity.value;
  }

  render() {
    const {character, isDM, isSelected, selectable} = this.props;
    const {isExpanded} = this.state;

    return (
      <div className={classNames('card',
        'character',
        {'card-selectable': selectable},
        {'card-unselectable': !selectable},
        {'card-selected': isSelected})}>
        <div className="card-name center">{character.name}</div>
        <div className="card-inner">
          {character.imageURL &&
            <div className={classNames('card-avatar', 'center')}>
              <img src={character.imageURL} />
            </div>}
          <div className="card-text">
            <div className="card-field">
              <div>Race: {character.race}</div>
              <div>Class: {character.klass}</div>
            </div>
            <StatBubble character={character} size="med" isDM={isDM} />
          </div>
        </div>
        <div className="character-details" onClick={this.handleToggleDetails}>
          <img src={isExpanded ? detailsSelectedImg : detailsImg} />
        </div>
        {isExpanded &&
          <div>
            <div className="form-field character-stats character-stats--container">
              <div>
                <div className="character-stats--card center">STR</div>
                <div className="character-stats--value center">{character.str || '-'}</div>
                {getModifier(character.str) &&
                  <div className="character-stats--modifier center">{getModifier(character.str)}</div>
                }
              </div>
              <div>
                <div className="character-stats--card center">DEX</div>
                <div className="character-stats--value character-stat--card center">{character.dex || '-'}</div>
                {getModifier(character.dex) &&
                  <div className="character-stats--modifier center">{getModifier(character.dex)}</div>
                }
              </div>
              <div>
                <div className="character-stats--card center">CON</div>
                <div className="character-stats--value character-stat--card center">{character.con || '-'}</div>
                {getModifier(character.con) &&
                  <div className="character-stats--modifier center">{getModifier(character.con)}</div>
                }
              </div>
              <div>
                <div className="character-stats--card center">INT</div>
                <div className="character-stats--value character-stat--card center">{character.int || '-'}</div>
                {getModifier(character.int) &&
                  <div className="character-stats--modifier center">{getModifier(character.int)}</div>
                }
              </div>
              <div>
                <div className="character-stats--card center">WIS</div>
                <div className="character-stats--value character-stat--card center">{character.wis || '-'}</div>
                {getModifier(character.wis) &&
                  <div className="character-stats--modifier center">{getModifier(character.wis)}</div>
                }
              </div>
              <div>
                <div className="character-stats--card center">CHA</div>
                <div className="character-stats--value character-stat--card center">{character.cha || '-'}</div>
                {getModifier(character.cha) &&
                  <div className="character-stats--modifier center">{getModifier(character.cha)}</div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
