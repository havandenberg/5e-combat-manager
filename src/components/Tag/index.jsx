import React from 'react';
import ReactTooltip from 'react-tooltip';

export default class Tag extends React.Component {
  static propTypes = {
    description: React.PropTypes.string,
    text: React.PropTypes.string,
    type: React.PropTypes.string.isRequired
  }

  render() {
    const {description, type, text} = this.props;

    return (
      <div>
        <div className={`tag tag-${type}`} data-tip={true} data-for={type}>
          {text ? text.toUpperCase() : type.toUpperCase()}
        </div>
        {description && <ReactTooltip id={type} type="dark">
          <span>{description}</span>
        </ReactTooltip>}
      </div>
    );
  }
}
