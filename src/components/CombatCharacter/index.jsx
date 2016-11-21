import React from 'react';
import _ from 'lodash';
import StatBubble from 'components/StatBubble';
import Tag from 'components/Tag';
import CombatActions from 'components/CombatActions';

import lockedImg from 'images/locked.svg';
import unlockedImg from 'images/unlocked.svg';
import notesImg from 'images/notes.svg';
import notesEmptyImg from 'images/notes-empty.svg';

const tags = [
  {type: 'blinded', text: 'bli'},
  {type: 'charmed', text: 'chr'},
  {type: 'deafened', text: 'def'},
  {type: 'frightened', text: 'fri'},
  {type: 'grappled', text: 'grp'},
  {type: 'incapacitated', text: 'inc'},
  {type: 'invisible', text: 'inv'},
  {type: 'paralyzed', text: 'par'},
  {type: 'petrified', text: 'pet'},
  {type: 'poisoned', text: 'poi'},
  {type: 'prone', text: 'prn'},
  {type: 'restrained', text: 'rst'},
  {type: 'stunned', text: 'stn'},
  {type: 'unconscious', text: 'unc'}
];

export default class CombatCharacter extends React.Component {
  static propTypes = {
    character: React.PropTypes.object.isRequired,
    combat: React.PropTypes.object.isRequired,
    isDM: React.PropTypes.bool.isRequired,
    updateCombat: React.PropTypes.func,
    view: React.PropTypes.bool
  }

  constructor() {
    super();

    this.state = {
      notesOpen: false
    };
  }

  hasTag = (tagsArray, type) => {
    let result = false;
    _.each(tagsArray, (t) => {
      if (t.type === type) {result = true;}
    });
    return result;
  }

  handleEditNotes = () => {
    const {character, updateCombat} = this.props;
    character.notes = this.refs.notes.value;
    updateCombat();
  }

  handleOpenNotes = () => {
    this.setState({notesOpen: true});
  }

  handleCloseNotes = (e) => {
    if (e.target.type !== 'textarea') {
      this.setState({notesOpen: false});
    }
  }

  handleSelectTag = (e) => {
    const {character, updateCombat} = this.props;
    const tag = e.target.value;
    let newTag = {};
    _.each(tags, (t) => {
      if (t.type === tag) {newTag = t;}
    });
    if (character.tags) {
      if (this.hasTag(character.tags, tag)) {
        _.remove(character.tags, (t) => {
          if (t.type === tag) {return true;}
        });
      } else {
        character.tags.push(newTag);
      }
    } else {
      character.tags = [newTag];
    }
    this.refs.selectTag.value = 'Status';
    updateCombat();
  }

  handleRemoveTag = (tag) => {
    return (e) => {
      e.preventDefault();
      const {character, updateCombat} = this.props;
      _.remove(character.tags, (t) => {
        if (t === tag) {return true;}
      });
      updateCombat();
    };
  }

  handleToggleLockCharacter = () => {
    const {character, updateCombat} = this.props;
    character.isLocked = !character.isLocked;
    updateCombat();
  }

  render() {
    const {character, combat, isDM, updateCombat, view} = this.props;
    const {notesOpen} = this.state;

    return (
      <div>
        <div className="combat-character">
          {!view &&
            <div className="combat-character--tag-container">
              <div className="combat-character--tag" onClick={this.handleOpenNotes}>
                <img src={(character.notes && character.notes.length > 0) ? notesImg : notesEmptyImg} />
              </div>
              <div className="combat-character--tag" onClick={this.handleToggleLockCharacter}>
                <img src={character.isLocked ? lockedImg : unlockedImg} />
              </div>
              {character.isNPC &&
                <div className="combat-character--tag no-cursor"><Tag type="npc" /></div>
              }
            </div>
          }
          <div className="card-name center">{character.name}</div>
          <div className="inner-one">
            {character.imageURL &&
              <div className="inner-one--avatar center">
                <img src={character.imageURL} />
              </div>
            }
            <div className="card-text card-field">
              <div className="card-field">
                <div>Race: {character.race}</div>
                <div>Class: {character.klass}</div>
              </div>
              <div className="card-field character-tag--container">
                {character.tags &&
                  character.tags.map((t, i) => {
                    return (
                      <div className="character-tag" key={i} onClick={this.handleRemoveTag(t)}>
                        <Tag type={t.type} text={t.text} />
                      </div>
                    );
                  })
                }
                {!view &&
                  <select
                    onChange={this.handleSelectTag}
                    ref="selectTag" >
                    <option key="">Status</option>
                    {
                      tags.map((t, i) => {
                        return <option key={i}>{t.type}</option>;
                      })
                    }
                  </select>
                }
              </div>
              <div className="card-field bubbles">
                <StatBubble
                  character={character}
                  size="med"
                  isDM={isDM}
                  isEditable={!view}
                  updateCombat={updateCombat} />
              </div>
            </div>
          </div>
          {character.isNPC && !view && combat.isStarted &&
            <div className="dm-combat-content">
              <CombatActions character={character} combat={combat} isUpNow={true} updateCombat={updateCombat} />
            </div>
          }
          {notesOpen &&
            <div className="notes-container" onClick={this.handleCloseNotes}>
              <textarea
                defaultValue={character.notes || ''}
                placeholder="Enter character notes (saves automatically)."
                type="text"
                ref="notes"
                onChange={this.handleEditNotes} />
            </div>
          }
        </div>
      </div>
    );
  }
}
