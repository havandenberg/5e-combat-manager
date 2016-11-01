import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {hasError} from 'utils/errors';
import * as authActions from 'reducers/auth';

import backImg from 'images/back.svg';

class PlayerLogin extends React.Component {
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
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    if (_.isEmpty(email)) {
      errors.push('emailEmpty');
    }

    if (_.isEmpty(password)) {
      errors.push('passwordEmpty');
    }

    this.setState({errors});
    return (!errors.length);
  }

  handleLogin = (e) => {
    e.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    if (this.validate()) {
      this.props.login(email, password);
    }
  }

  render() {
    const {errors} = this.state;

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          <div className="page-title vcenter center">Player Login</div>
        </div>
        <div className="page-content">
          <form onSubmit={this.handleLogin}>
            {hasError(errors, ['emailEmpty']) && <div className="alert alert-error">Enter email</div>}
            <div className="form-field">
              <input
                className={classNames({'input-error': hasError(errors, ['email'])})}
                placeholder="email"
                type="text"
                ref="email" />
            </div>
            {hasError(errors, ['passwordEmpty']) && <div className="alert alert-error">Enter password</div>}
            <div className="form-field">
              <input
                className={classNames({'input-error': hasError(errors, ['password'])})}
                placeholder="password"
                type="password"
                ref="password" />
            </div>
            <div className="form-field center">
              <button className="btn btn-action full-width" type="submit">Login</button>
            </div>
            <div className="form-field center">
              <Link to="/create-account"><button className="btn btn-action full-width">Create account</button></Link>
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
})(PlayerLogin);
