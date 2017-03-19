import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import forwardImg from 'images/forward.svg';

export default class Breadcrumbs extends Component {
  static propTypes = {
    activeFolder: PropTypes.string.isRequired,
    folders: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  handleSelect = (folder) => {
    return (e) => {
      e.preventDefault();
      this.props.onSelect(folder);
    };
  }

  getParent = (breadcrumbs, folder) => {
    const {folders} = this.props;
    breadcrumbs.push(folder);
    if (folder.parent !== null) {
      const f = _.find(folders, (fold) => fold.id === folder.parent);
      if (f) {
        return this.getParent(breadcrumbs, f);
      }
    }
    return breadcrumbs;
  }

  getBreadcrumbs = () => {
    const {activeFolder, folders} = this.props;
    let breadcrumbs = [];
    if (activeFolder !== '') {
      breadcrumbs = this.getParent(breadcrumbs, _.find(folders, (f) => f.id === activeFolder)).reverse();
    }
    breadcrumbs.unshift({name: 'All'});
    return breadcrumbs;
  }

  render() {
    const breadcrumbs = this.getBreadcrumbs();

    return (
      <div className="breadcrumbs">
        {
          breadcrumbs.map((breadcrumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return <div className="breadcrumb-container" key={i}>
              <div
                className={classNames(
                  'breadcrumb',
                  {'breadcrumb-selected': isLast})}
                onClick={this.handleSelect(breadcrumb)}>{breadcrumb.name}</div>
              {!isLast &&
                <img className="breadcrumb-divider" src={forwardImg} />
              }
            </div>;
          })
        }
      </div>
    );
  }
}
