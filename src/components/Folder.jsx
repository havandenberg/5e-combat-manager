import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import editFolderImg from 'images/edit-folder.svg';
import removeImg from 'images/remove.svg';

export default class Folder extends Component {
  static propTypes = {
    folder: PropTypes.object.isRequired,
    isMovingCharacter: PropTypes.bool.isRequired,
    showConfirmDelete: PropTypes.bool.isRequired,
    onConfirmDelete: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  }

  state = {
    confirmDelete: false,
    isEditing: false,
    showButtons: false
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.showConfirmDelete) {
      this.setState({confirmDelete: false});
    }
  }

  componentDidUpdate() {
    if (this.state.isEditing) {
      this.refs.name.focus();
    }
  }

  handleNameChange = () => {
    const {folder} = this.props;
    folder.name = this.refs.name.value;
    this.props.onUpdate(folder);
    this.setState({isEditing: false});
  }

  handleDelete = (e) => {
    e.stopPropagation();
    this.props.onDelete(true);
    this.setState({confirmDelete: true});
  }

  resetDelete = (e) => {
    e.stopPropagation();
    this.props.onDelete(false);
    this.setState({confirmDelete: false});
  }

  handleConfirmDelete = (e) => {
    e.stopPropagation();
    this.props.onConfirmDelete(this.props.folder);
  }

  handleSelect = () => {
    if (!this.state.isEditing) {
      this.props.onSelect(this.props.folder);
    }
  }

  handleToggleEditing = (e) => {
    e.stopPropagation();
    this.setState({isEditing: !this.state.isEditing});
  }

  handleShowButtons = () => {
    const {isMovingCharacter} = this.props;
    if (!isMovingCharacter) {this.setState({showButtons: true});}
  }

  handleHideButtons = () => {
    this.setState({showButtons: false});
  }

  render() {
    const {folder, isMovingCharacter} = this.props;
    const {confirmDelete, isEditing, showButtons} = this.state;

    return (
      <div
        className={classNames(
          'folder',
          {'folder-hovered': (showButtons || confirmDelete) && !isMovingCharacter},
          {'folder-moving': isMovingCharacter})}
        onClick={this.handleSelect}
        onBlur={this.resetDelete}
        onMouseEnter={this.handleShowButtons}
        onMouseLeave={this.handleHideButtons}>
        {isEditing
          ? <input
            className="name name-editing"
            type="text"
            ref="name"
            onBlur={this.handleNameChange}
            defaultValue={folder.name} />
          : <div className="name">{folder.name}</div>
        }
        {showButtons && !confirmDelete &&
          <img
            src={isEditing ? editFolderImg : editFolderImg}
            className="folder-edit"
            onClick={this.handleToggleEditing} />}
        {(showButtons || confirmDelete) &&
          <img
            src={removeImg}
            className="folder-remove"
            onClick={confirmDelete ? this.handleConfirmDelete : this.handleDelete} />}
      </div>
    );
  }
}
