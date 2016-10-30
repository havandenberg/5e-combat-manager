import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {hasError} from 'utils/errors';
import * as characterActions from 'reducers/character';

import backImg from 'images/back.svg';

class ViewCharacter extends React.Component {
  static propTypes = {
    createCharacter: React.PropTypes.func.isRequired,
    isNew: React.PropTypes.bool.isRequired,
    updateCharacter: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      errors: []
    };
  }

  validate = () => {
    const errors = [];
    const name = this.refs.name.value;

    if (_.isEmpty(name)) {
      errors.push('nameEmpty');
    }

    this.setState({errors});
    return (!errors.length);
  }

  handleCreateCharacter = () => {
    const name = this.refs.name.value;
    const race = this.refs.race.value;
    const klass = this.refs.klass.value;
    const hp = this.refs.hp.value;
    const ac = this.refs.ac.value;

    if (this.validate()) {
      this.props.createCharacter({name, race, klass, hp, ac});
    }
  }

  render() {
    const {errors} = this.state;
    const {isNew} = this.props;

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/dashboard"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          <div className="page-title vcenter center">Create character</div>
        </div>
        <div className="page-content">
          {hasError(errors, ['nameEmpty']) && <div className="alert alert-error">Enter character name</div>}
          <div className="form-field">
            <input
              className={classNames({'input-error': hasError(errors, ['nameEmpty'])})}
              placeholder="name"
              type="text"
              ref="name" />
          </div>
          <div className="form-field">
            <input
              placeholder="race"
              type="text"
              ref="race" />
          </div>
          <div className="form-field">
            <input
              placeholder="class"
              type="text"
              ref="klass" />
          </div>
          <div className="form-field character-stats">
            <input
              placeholder="base hp"
              type="text"
              ref="hp" />
            <input
              placeholder="ac"
              type="text"
              ref="ac" />
          </div>
          <div className="form-field center">
            <button className="btn btn-action full-width" onClick={this.handleCreateCharacter}>Create character</button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(() => ({}), {
  createCharacter: characterActions.startAddCharacter,
  updateCharacter: characterActions.startUpdateCharacter
})(ViewCharacter);
