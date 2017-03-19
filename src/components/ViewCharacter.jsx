import React from 'react';
import classNames from 'classnames';
import StatBubble from 'components/StatBubble';
import Tag from 'components/Tag';

export default class ViewCharacter extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    isUpNext: React.PropTypes.bool,
    isUpNow: React.PropTypes.bool,
    started: React.PropTypes.bool
  }

  getQuantity = () => {
    return this.refs.quantity.value;
  }

  render() {
    const {character, isUpNow, isUpNext, started} = this.props;

    return (
      <div className={classNames(
        'card',
        'card-space--small',
        {'card-space--upnow': isUpNow && started},
        {'card-space--upnext': isUpNext && started},
        {'card-space--unc': character.hp <= 0})}>
        {character.imageURL &&
          <div className="card-avatar card-avatar--view">
            <img src={character.imageURL} />
          </div>}
        <div className={classNames('view-character--name', 'center', {'name-card--unc-text': character.hp <= 0})}>{character.name}</div>
        <div className="form-field--small character-tag--container">
          {character.tags &&
            character.tags.map((t, i) => {
              return (
                <div className="character-tag" key={i}>
                  <Tag type={t.type} text={t.text} description={t.description} size="small" />
                </div>
              );
            })
          }
        </div>
        <StatBubble character={character} size="small" isView={true} />
      </div>
    );
  }
}
