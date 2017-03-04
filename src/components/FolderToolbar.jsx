import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import addWhiteImg from 'images/add-white.svg';

export default class FolderToolbar extends Component {
  static propTypes = {
    activeFolder: PropTypes.array.isRequired,
    folders: PropTypes.object.isRequired,
    onAddFolder: PropTypes.func.isRequired,
    onDeleteFolder: PropTypes.func.isRequired,
    onUpdateFolder: PropTypes.func.isRequired
  }

  getBreadcrumbs = () => {
    const {activeFolder} = this.props;
    let breadcrumbs = 'All';
    _.each(activeFolder, (f) => {
      breadcrumbs += ` -> ${f.name}`;
    });
    return breadcrumbs;
  }

  handleAddFolder = () => {
    this.props.onAddFolder();
  }

  handleDeleteFolder = () => {
    this.props.onDeleteFolder();
  }

  handleNameChange = (folder) => {
    return (e) => {
      e.preventDefault();
      folder.name = e.target.value;
      this.props.onUpdateFolder(folder);
    };
  }

  handleToggleSelected = (folder) => {
    return (e) => {
      e.preventDefault();
      folder.selected = !folder.selected;
      this.props.onUpdateFolder(folder, true);
    };
  }

  render() {
    const {folders} = this.props;

    return (
      <div>
        <div className="breadcrumbs">{this.getBreadcrumbs()}</div>
        <div className="folder-container">
          <div className="folder-inner scroll scroll-folder">
            {folders.map((f, i) => {
              return <div key={i} className={
                classNames('folder', {'folder-selected': f.selected})} onClick={this.handleToggleSelected(f)}>
                {f.isEditing && <input
                  className="name"
                  ref="name"
                  value={f.name}
                  onChange={this.handleNameChange(f)}
                  onBlur={this.handleFinishEditing(f)}/>}
                {!f.isEditing && <div className="name">{f.name}</div>}
              </div>;
            })}
          </div>
          <div className="folder-add" onClick={this.handleAddFolder}><img src={addWhiteImg} /></div>
        </div>
      </div>
    );
  }
}
