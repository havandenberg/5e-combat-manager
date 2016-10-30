import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {hasError} from 'utils/errors';
import * as authActions from 'reducers/auth';

import backImg from 'images/back.svg';

class CreateAccount extends React.Component {
  static propTypes = {
    auth: React.PropTypes.object.isRequired,
    createAccount: React.PropTypes.func.isRequired
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
    const confirmPassword = this.refs.confirmPassword.value;

    if (_.isEmpty(email)) {
      errors.push('emailEmpty');
    }

    if (_.isEmpty(password)) {
      errors.push('passwordEmpty');
    }

    if (_.isEmpty(confirmPassword)) {
      errors.push('confirmPasswordEmpty');
    }

    if (password !== confirmPassword) {
      errors.push('passwordMatch');
    }

    this.setState({errors});
    return (!errors.length);
  }

  handleCreateAccount = () => {
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    if (this.validate()) {
      this.props.createAccount(email, password);
    }
  }

  render() {
    const {errors} = this.state;

    return (
      <div className="page">
        <div className="page-header">
          <Link to="/player-login"><button className="btn-back pull-left"><img src={backImg} /></button></Link>
          <div className="page-title vcenter center">Create Account</div>
        </div>
        <div className="page-content">
          {hasError(errors, ['emailEmpty']) && <div className="alert alert-error">Enter email</div>}
          <div className="form-field">
            <input
              className={classNames({'input-error': hasError(errors, ['emailEmpty'])})}
              placeholder="email"
              type="email"
              ref="email" />
          </div>
          {hasError(errors, ['passwordEmpty']) && <div className="alert alert-error">Enter password</div>}
          {hasError(errors, ['passwordMatch']) && <div className="alert alert-error">Passwords do not match</div>}
          <div className="form-field">
            <input
              className={classNames({'input-error': hasError(errors, ['passwordEmpty', 'passwordMatch'])})}
              placeholder="password"
              type="password"
              ref="password" />
          </div>
          {hasError(errors, ['confirmPasswordEmpty']) && <div className="alert alert-error">Enter password confirmation</div>}
          <div className="form-field">
            <input
              className={classNames({'input-error': hasError(errors, ['confirmPasswordEmpty', 'passwordMatch'])})}
              placeholder="confirm password"
              type="password"
              ref="confirmPassword" />
          </div>
          <div className="form-field center">
            <button className="btn btn-action full-width" onClick={this.handleCreateAccount}>Create account</button>
          </div>
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
  createAccount: authActions.startCreateAccount
})(CreateAccount);
