import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {smoothScrollTo} from 'utils/resources';
import Tag from 'components/Tag';

import * as combatActions from 'reducers/combat';
import * as folderActions from 'reducers/folder';

import CharacterCard from 'components/CharacterCard';
import CombatCard from 'components/CombatCard';
import FolderToolbar from 'components/FolderToolbar';
import addWhiteImg from 'images/add-white.svg';

class Dashboard extends React.Component {
  static propTypes = {
    characters: React.PropTypes.object.isRequired,
    combats: React.PropTypes.object.isRequired,
    createFolder: React.PropTypes.func.isRequired,
    deleteFolder: React.PropTypes.func.isRequired,
    folders: React.PropTypes.object,
    isDM: React.PropTypes.bool,
    uid: React.PropTypes.string,
    updateCombat: React.PropTypes.func.isRequired,
    updateFolder: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      activeFolder: [],
      isAdding: false,
      combat: null,
      characterOrder: 'Name',
      searchCharacters: '',
      searchCombats: '',
      showArchived: false
    };
  }

  getActiveFolderLocation = () => {
    const {activeFolder} = this.state;
    let breadcrumbs = '';
    _.each(activeFolder, (f) => {
      breadcrumbs += `${f.id}/`;
    });
    return breadcrumbs;
  }

  getCombatIndex = (combat) => {
    const {combats} = this.props;
    let index = 0;
    let stop = false;
    combats.map((c) => {
      if (combat.id === c.id) {stop = true;}
      if (!stop) {index++;}
    });
    return index;
  }

  getParsedCombats = () => {
    const {combats, isDM} = this.props;
    return isDM ? combats : combats.filter((c) => {
      return c.isActive;
    });
  }

  hasCharactersInCombat = (c) => {
    const result = [];
    _.each(c.charactersInCombat, (char) => {
      if (char.user === this.props.uid && !char.isRemoved) {
        result.push(char.name);
      }
    });
    return result;
  }

  handleAddFolder = () => {
    this.props.createFolder({name: 'New Folder', selected: false}, this.getActiveFolderLocation());
  }

  handleUpdateFolder = (folder, isSelecting) => {
    const {activeFolder} = this.state;
    if (isSelecting) {this.setState({activeFolder: [...activeFolder, folder]});}
    this.props.updateFolder(folder, isSelecting ? `${this.getActiveFolderLocation()}/${folder.id}` : this.getActiveFolderLocation());
  }

  handleDeleteFolder = () => {

  }

  handleCharacterOrder = (e) => {
    this.setState({characterOrder: e.target.value});
  }

  handleChooseCharacter = (c) => {
    return (e) => {
      if (e) {e.preventDefault();}
      const {updateCombat, uid} = this.props;
      const {isAdding, combat} = this.state;
      if (isAdding) {
        let result = false;
        _.each(combat.charactersInCombat, (char) => {
          if (c.id === char.id) {
            char.isRemoved = false;
            result = true;
          }
        });
        if (combat.undoIndex > 0) {
          combat.actions.splice(0, combat.undoIndex);
          combat.undoIndex = 0;
        }
        combat.actions.splice(0, 0, {type: 2, target: c, isRemoved: false});
        if (!result) {
          c.isRemoved = false;
          c.user = uid;
          combat.charactersInCombat.push(c);
          combat.isStarted = false;
        }
        updateCombat(combat.id, combat);
        this.setState({isAdding: false, combat: null});
      }
    };
  }

  handleToggleAdd = (combat) => {
    return (e) => {
      if (e) {e.preventDefault();}
      this.setState({isAdding: !this.state.isAdding, combat});
    };
  }

  handleToggleShowArchived = () => {
    this.setState({showArchived: !this.state.showArchived});
  }

  handleSearchCombats = (e) => {
    this.setState({searchCombats: e.target.value});
  }

  handleSearchCharacters = (e) => {
    this.setState({searchCharacters: e.target.value});
  }

  searchCombats = (c) => {
    const {searchCombats} = this.state;
    const text = c.name + c.description;
    return text.toLowerCase().includes(searchCombats.toLowerCase());
  }

  searchCharacters = (c) => {
    const {searchCharacters} = this.state;
    const text = c.name + c.race + c.klass + c.notes;
    return text.toLowerCase().includes(searchCharacters.toLowerCase());
  }

  scrollToCharacters = () => {
    smoothScrollTo('bottom');
  }

  render() {
    const {characters, isDM, folders, updateCombat} = this.props;
    const {activeFolder, characterOrder, combat, isAdding, showArchived} = this.state;
    const parsedCombats = this.getParsedCombats();

    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title vcenter center">{`${isDM ? 'DM ' : ''}Dashboard`}</div>
        </div>
        <div className="page-content">
          <div className="field-container field-container--row character-header">
            <div className="page-subtitle">{`${isDM ? 'Saved' : 'Active'} combats`}</div>
            {isDM &&
              <div className="options">
                <div className="tag-combat-card--show" onClick={this.handleToggleShowArchived}>
                  <Tag
                    type={showArchived ? 'unarchived' : 'archived'}
                    text={showArchived ? 'archived' : 'unarchived'} />
                </div>
                <input type="text" placeholder="Search" onChange={this.handleSearchCombats} />
                <Link to="/create-combat"><div className="folder-add add-character"><img src={addWhiteImg} /></div></Link>
              </div>
            }
          </div>
          <div className="card-container card-container--combat scroll scroll-combat card-field">
            {!parsedCombats.isEmpty()
              ? parsedCombats.filter((c) => {
                return this.searchCombats(c) && (showArchived ? c.isArchived : !c.isArchived);
              }).reverse().map((c, i) => {
                return (
                  <div key={i} className="card-wrapper--combat">
                    <CombatCard
                      characterNames={isDM ? [] : this.hasCharactersInCombat(c)}
                      combat={c}
                      index={this.getCombatIndex(c)}
                      isDM={isDM}
                      isAdding={isAdding && combat.id === c.id}
                      updateCombat={updateCombat}
                      onToggleAdd={this.handleToggleAdd(c)} />
                  </div>
                );
              })
              : <div className="combats-empty center">{`No ${isDM ? 'saved' : 'active'} combats`}</div>
            }
          </div>
          <hr className="hr" />
          <div className="page-subtitle character-header">
            <div ref="line">{`${isDM ? 'NPCs' : 'Characters'}`}</div>
            <div className="options">
              <select
                onChange={this.handleCharacterOrder}
                ref="characterOrder" >
                <option>Name</option>
                <option>Created</option>
                <option>Class</option>
              </select>
              <input type="text" placeholder="Search" onChange={this.handleSearchCharacters} />
              <Link to="/create-character"><div className="folder-add add-character"><img src={addWhiteImg} /></div></Link>
            </div>
          </div>
          {false && <FolderToolbar
            activeFolder={activeFolder}
            folders={folders}
            onAddFolder={this.handleAddFolder}
            onDeleteFolder={this.handleDeleteFolder}
            onUpdateFolder={this.handleUpdateFolder} />}
          <div className="card-container scroll scroll-characters card-field" onMouseEnter={this.scrollToCharacters}>
            {!characters.isEmpty()
              ? characters.filter((c) => {
                return this.searchCharacters(c);
              }).sort((a, b) => {
                let x = 0;
                let y = 0;
                switch (characterOrder) {
                case 'Name':
                  x = a.name;
                  y = b.name;
                  break;
                case 'Created':
                  x = a.createdAt || 0;
                  y = b.createdAt || 0;
                  break;
                default:
                  x = a.klass;
                  y = b.klass;
                }
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
              }).map((c, i) => {
                return (
                    <div key={i} className="card-wrapper">
                      {isAdding
                        ? <div onClick={this.handleChooseCharacter(c)}><CharacterCard character={c} isDM={isDM} /></div>
                        : <Link className="no-decoration" to={`/edit-character/${characters.indexOf(c)}`}>
                          <CharacterCard character={c} isDM={isDM} />
                        </Link>
                      }
                    </div>
                );
              })
              : <div className="combats-empty center">No characters</div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    characters: state.characters,
    combats: state.combats,
    folders: state.folders,
    isDM: state.auth.get('isDM'),
    uid: state.auth.get('uid')
  };
}, {
  updateCombat: combatActions.startUpdateCombat,
  createFolder: folderActions.startAddFolder,
  updateFolder: folderActions.startUpdateFolder,
  deleteFolder: folderActions.startDeleteFolder
})(Dashboard);
