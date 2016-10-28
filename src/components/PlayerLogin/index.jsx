import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as authActions from 'reducers/auth';
import {hasError} from 'utils/errors';

class Login extends React.Component {
  static propTypes = {
    checkUsername: React.PropTypes.func
  }

  constructor() {
    super();

    this.state = {
      username: '',
      rememberMe: false,
      errors: []
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {username, rememberMe} = this.state;
    const errors = this.validate();
    this.setState({errors});
    if (!errors.length) {this.props.checkUsername(username, rememberMe);}
  }

  handleFormChange = (field) => {
    return (e) => {
      const newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      this.setState({[field]: newValue});
    };
  }

  validate = () => {
    const {username} = this.state;
    const errors = [];

    if (_.isEmpty(username)) {
      errors.push('username');
    }

    return errors;
  }

  render() {
    const {errors} = this.state;

    return (
      <div className="page login">
        <div className="page-header">
          <h1>Customer Login</h1>
        </div>
        <div className="page-inner">
          <div className="page-section">
            {hasError(errors, ['username']) &&
              <div className="alert alert-error">
                Some of the required information is missing or incorrect. Items in red need to be completed or corrected.
              </div>
            }
            <form onSubmit={this.handleSubmit}>
              <div className="field-container">
                <div className={classNames('form-label', {'form-label__error': hasError(errors, ['username'])})}>User Name</div>
                <div className="form-field">
                  <input
                    className={classNames({'input-error': hasError(errors, ['username'])})}
                    type="text"
                    label="User Name"
                    value={this.state.username}
                    onChange={this.handleFormChange('username')} />
                </div>
                <div className="form-field">
                  <label>
                    <input
                      type="checkbox"
                      value={this.state.rememberMe}
                      onChange={this.handleFormChange('rememberMe')} />
                  Remember Me</label>
                </div>
              </div>
              <button className="btn btn-primary" type="submit">Continue</button>
            </form>
            <Link to="">I forgot my user name</Link>
          </div>
          <div className="page-section">
            <h2>New to Amica?</h2>
            <Link to="/register"><button className="btn btn-primary">Create Account</button></Link>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(() => ({}), {
  ...authActions
})(Login);
