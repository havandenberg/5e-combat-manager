import React from 'react';
import classNames from 'classnames';
import StatBubble from 'components/StatBubble';
import Tag from 'components/Tag';

import forwardImg from 'images/forward.svg';

export default class CharacterCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    handleChooseCharacter: React.PropTypes.func,
    handleRemoveCharacter: React.PropTypes.func,
    isChoose: React.PropTypes.bool,
    isDM: React.PropTypes.bool,
    isEditCombat: React.PropTypes.bool,
    isInCombat: React.PropTypes.bool,
    isSelected: React.PropTypes.bool,
    selectable: React.PropTypes.bool
  }

  getQuantity = () => {
    return this.refs.quantity.value;
  }

  render() {
    const {character, handleChooseCharacter, handleRemoveCharacter, isChoose} = this.props;
    const {isDM, isInCombat, isSelected, selectable} = this.props;

    return (
      <div className={classNames('card',
        {'card-selectable': selectable},
        {'card-unselectable': !selectable && !isChoose},
        {'card-selected': isSelected},
        {'card-choose': isChoose})}>
        {isInCombat && !character.isRemoved &&
          <div className="card--tag-container">
              <div className="card--tag" onClick={handleRemoveCharacter}><Tag type="inactive" text="In Combat" /></div>
          </div>
        }
        {character.imageURL &&
          <div className={classNames('card-avatar', 'center', {'card-avatar--large': isChoose})}>
            <img src={character.imageURL} />
          </div>}
        <div className="card-text card-field">
          <div className="card-name center">{character.name}</div>
          <div className="card-field">
            <div>Race: {character.race}</div>
            <div>Class: {character.klass}</div>
          </div>
          <div className="card-field">
            <StatBubble character={character} size="med" isDM={isDM} />
          </div>
        </div>
        {!selectable && !isChoose &&
          <div className="card-forward">
            <img src={forwardImg} />
          </div>
        }
        {isChoose &&
          <button className="btn btn-choose center" onClick={handleChooseCharacter}>Enter combat!</button>
        }
      </div>
    );
  }
}
