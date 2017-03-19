import React, {PropTypes, Component} from 'react';
import Folder from 'components/Folder';
import Breadcrumbs from 'components/Breadcrumbs';
import addWhiteImg from 'images/add-white.svg';

export default class FolderToolbar extends Component {
  static propTypes = {
    activeFolder: PropTypes.string.isRequired,
    folders: PropTypes.array.isRequired,
    isEditCombat: PropTypes.bool,
    isMovingCharacter: PropTypes.bool.isRequired,
    onAddFolder: PropTypes.func.isRequired,
    onDeleteFolder: PropTypes.func.isRequired,
    onSelectFolder: PropTypes.func.isRequired,
    onUpdateFolder: PropTypes.func.isRequired
  }

  state = {
    showConfirmDelete: false
  }

  handleAdd = () => {
    this.props.onAddFolder();
  }

  getChildFolders = (foldersToDelete, folder) => {
    const {folders} = this.props;
    foldersToDelete.push(folder);
    folders.map((f) => {
      if (f.parent === folder.id) {
        return this.getChildFolders(foldersToDelete, f);
      }
    });
    return foldersToDelete;
  }

  handleDelete = (showConfirmDelete) => {
    this.setState({showConfirmDelete});
  }

  handleConfirmDelete = (folder) => {
    const {onDeleteFolder} = this.props;
    const foldersToDelete = this.getChildFolders([], folder);
    onDeleteFolder(foldersToDelete);
    this.setState({showConfirmDelete: false});
  }

  handleNameChange = (folder) => {
    this.props.onUpdateFolder(folder);
  }

  handleSelect = (folder) => {
    this.props.onSelectFolder(folder);
    this.setState({showConfirmDelete: false});
  }

  render() {
    const {activeFolder, folders, isEditCombat, isMovingCharacter} = this.props;
    const {showConfirmDelete} = this.state;

    return (
      <div className="form-field">
        <div className="folder-container">
            <Breadcrumbs className="folder-inner" folders={folders} activeFolder={activeFolder} onSelect={this.handleSelect} />
          {!isEditCombat &&
            <div className="folder-add" onClick={this.handleAdd}>
              <img src={addWhiteImg} />
            </div>
          }
        </div>
        {showConfirmDelete &&
          <div className="folder-confirm-delete">
            Confirm delete folder and all children?
          </div>
        }
        <div className="folder-inner scroll scroll-folder">
          {folders.filter((folder) => {
            return folder.parent === activeFolder;
          }).map((f, i) => {
            return <Folder
              key={i}
              folder={f}
              isEditCombat={isEditCombat}
              isMovingCharacter={isMovingCharacter}
              showConfirmDelete={showConfirmDelete}
              onUpdate={this.handleNameChange}
              onSelect={this.handleSelect}
              onConfirmDelete={this.handleConfirmDelete}
              onDelete={this.handleDelete} />;
          })}
        </div>
      </div>
    );
  }
}
