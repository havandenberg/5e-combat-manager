import React from 'react';
import _ from 'lodash';
import StatBubble from 'components/StatBubble';
import Tag from 'components/Tag';
import CombatActions from 'components/CombatActions';
import DeathSaves from 'components/DeathSaves';

import lockedImg from 'images/locked.svg';
import unlockedImg from 'images/unlocked.svg';
import notesImg from 'images/notes.svg';
import notesEmptyImg from 'images/notes-empty.svg';

const tags = [
  {type: 'blinded', text: 'bli', description: 'Blinded: Cannot see.'},
  {type: 'burned', text: 'brn', description: 'Burned: Must make CON saving throw.'},
  {type: 'charmed', text: 'chr', description: 'Charmed: Cannot attack the charmer.'},
  {type: 'deafened', text: 'def', description: 'Deafened: Cannot hear, fails checks that require hearing.'},
  {type: 'frightened', text: 'fri', description: 'Frightened: Cannot move closer to source of fear, has disadvantage on ability checks and attack rolls if source of fear is within line of sight.'}, // eslint-disable-line max-len
  {type: 'frozen', text: 'frz', description: 'Frozen: Half speed, CON saving throw or cannot move.'}, // eslint-disable-line max-len
  {type: 'grappled', text: 'grp', description: 'Grappled: Cannot move without breaking grapple.'},
  {type: 'incapacitated', text: 'inc', description: 'Incapacitated: Cannot take actions.'},
  {type: 'invisible', text: 'inv', description: 'Invisible: Cannot be seen. Attack rolls have advantage.'},
  {type: 'paralyzed', text: 'par', description: 'Paralyzed: Cannot move, enemy attacks have advantage, auto fail STR and DEX saving throws. Any attack within 5 feet is a crit.'}, // eslint-disable-line max-len
  {type: 'petrified', text: 'pet', description: 'Petrified: Weight increases by factor of 10, cannot move, speak, or take actions, resistance to all damage, immune to poison and disase, auto fail DEX and STR saving throws.'}, // eslint-disable-line max-len
  {type: 'poisoned', text: 'poi', description: 'Poisoned: Roll saving throw, apply damage if failed.'},
  {type: 'prone', text: 'prn', description: 'Prone: Can only crawl, disadvantage on attack rolls.'},
  {type: 'restrained', text: 'rst', description: 'Restrained: Cannot move, has disadvantage on attack rolls and DEX saving throws.'},
  {type: 'stunned', text: 'stn', description: 'Stunned: Cannot take actions, fails STR and DEX saving throws, enemy attacks have advantage.'}, // eslint-disable-line max-len
  {type: 'transformed', text: 'tsf', description: 'Transformed: Character is transformed into another creature.'}, // eslint-disable-line max-len
  {type: 'unconscious', text: 'unc', description: 'Unconscious: Drops whatever is holding, cannot move, take actions, unaware of surroundings, enemy attacks have advantage, attacks within 5ft are crits.'} // eslint-disable-line max-len
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
              {character.hp > 0 && <div className="card-field character-tag--container">
                {character.tags &&
                  character.tags.map((t, i) => {
                    return (
                      <div className="character-tag" key={i} onClick={this.handleRemoveTag(t)}>
                        <Tag type={t.type} text={t.text} description={t.description} />
                      </div>
                    );
                  })
                }
                {!view &&
                  <select
                    className="status"
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
              </div>}
              {character.hp <= 0 &&
                <DeathSaves character={character} updateCombat={updateCombat} />
              }
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
