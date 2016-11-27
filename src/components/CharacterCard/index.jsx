import React from 'react';
import classNames from 'classnames';
import StatBubble from 'components/StatBubble';

import forwardImg from 'images/forward.svg';

export default class CharacterCard extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    isDM: React.PropTypes.bool,
    isEditCombat: React.PropTypes.bool,
    isSelected: React.PropTypes.bool,
    selectable: React.PropTypes.bool
  }

  getQuantity = () => {
    return this.refs.quantity.value;
  }

  render() {
    const {character} = this.props;
    const {isDM, isSelected, selectable} = this.props;

    return (
      <div className={classNames('card',
        {'card-selectable': selectable},
        {'card-unselectable': !selectable},
        {'card-selected': isSelected})}>
        {character.imageURL &&
          <div className={classNames('card-avatar', 'center')}>
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
        {!selectable &&
          <div className="card-forward">
            <img src={forwardImg} />
          </div>
        }
      </div>
    );
  }
}
