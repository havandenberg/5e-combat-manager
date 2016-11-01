import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {hasError} from 'utils/errors';
import * as authActions from 'reducers/auth';

import backImg from 'images/back.svg';

class DMLogin extends React.Component {
  static propTypes = {
    auth: React.PropTypes.object.isRequired,
    login: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      errors: []
    };
  }

  validate = () => {
    const errors = [];
    const password = this.refs.password.value;

    if (_.isEmpty(password)) {
      errors.push('passwordEmpty');
    }

    if (password !== 'slaiderules') {
      errors.push('passwordIncorrect');
    }

    this.setState({errors});
    return (!errors.length);
  }

  handleLogin = (e) => {
    e.preventDefault();
    if (this.validate()) {
      this.props.login('dm@5ecombatmanager.com', this.refs.password.value);
    } else {this.refs.password.value = '';}
  }

  render() {
    const {errors} = this.state;

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          <div className="page-title vcenter center">DM Login</div>
        </div>
        <div className="page-content">
          <form onSubmit={this.handleLogin}>
            {hasError(errors, ['passwordEmpty', 'passwordIncorrect']) &&
              <div className="alert alert-error">
                {hasError(errors, ['passwordEmpty']) ? 'Enter password' : 'Incorrect password'}
              </div>
            }
            <div className="form-field">
              <input
                className={classNames({'input-error': hasError(errors, ['passwordEmpty', 'passwordIncorrect'])})}
                placeholder="enter DM password"
                type="password"
                ref="password" />
            </div>
            <div className="form-field center">
              <button className="btn btn-action full-width" type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    auth: state.auth
  };
}, {
  login: authActions.startLogin
})(DMLogin);
