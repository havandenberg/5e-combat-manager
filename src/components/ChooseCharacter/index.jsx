import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import * as combatActions from 'reducers/combat';

import addImg from 'images/add.svg';
import removeImg from 'images/remove.svg';

class ChooseCharacter extends React.Component {
  static propTypes = {
    characters: React.PropTypes.object.isRequired,
    combat: React.PropTypes.object.isRequired,
    combatIndex: React.PropTypes.number.isRequired,
    isAdding: React.PropTypes.bool,
    uid: React.PropTypes.string.isRequired,
    updateCombat: React.PropTypes.func.isRequired,
    onToggleAdd: React.PropTypes.func.isRequired
  }

  handleChooseCharacter = (c) => {
    return (e) => {
      if (e) {e.preventDefault();}
      const {combat, combatIndex, updateCombat, uid} = this.props;
      let result = false;
      _.each(combat.charactersInCombat, (char) => {
        if (c.id === char.id) {
          char.isRemoved = false;
          result = char;
        }
      });
      if (!result) {
        c.isRemoved = false;
        c.user = uid;
        combat.charactersInCombat.push(c);
        combat.isStarted = false;
      }
      updateCombat(combat.id, combat, `/player-combat/${combatIndex}/${c.name}`);
    };
  }

  handleToggleAdd = () => {
    this.props.onToggleAdd();
  }

  handleRemoveCharacter = (c) => {
    return (e) => {
      e.preventDefault();
      const {combat, updateCombat} = this.props;
      if (this.isInCombat(c)) {
        _.each(combat.charactersInCombat, (char) => {
          if (c.id === char.id) {char.isRemoved = true;}
        });
        if (combat.undoIndex > 0) {
          combat.actions.splice(0, combat.undoIndex);
          combat.undoIndex = 0;
        }
        combat.actions.splice(0, 0, {type: 2, target: c, isRemoved: true});
        updateCombat(combat.id, combat, '#');
      }
    };
  }

  isInCombat = (c) => {
    const {combat} = this.props;
    let result = false;
    _.each(combat.charactersInCombat, (char) => {
      if (c.id === char.id && !char.isRemoved) {result = true;}
    });
    return result;
  }

  render() {
    const {characters, isAdding} = this.props;

    return (
      <div className="choose-character choose-character--container">
        {!characters.isEmpty() &&
          characters.filter((c) => {
            return this.isInCombat(c);
          }).map((c, i) => {
            return (
              <div key={i} className="choose-character">
                {this.isInCombat(c) && !c.isRemoved &&
                  <img className="choose-character--remove" src={removeImg} onClick={this.handleRemoveCharacter(c)} />
                }
                {c.imageURL &&
                  <div className="card-avatar circle card-avatar--choose" onClick={this.handleChooseCharacter(c)}>
                    <img src={c.imageURL} />
                  </div>}
              </div>
            );
          })
        }
        <div className={classNames('choose-character--add', {adding: isAdding})} onClick={this.handleToggleAdd}>
          <img src={addImg} />
        </div>
      </div>
    );
  }
}

export default connect((state) => {

  return {
    characters: state.characters,
    uid: state.auth.get('uid')
  };
}, {
  updateCombat: combatActions.startUpdateCombat
})(ChooseCharacter);
