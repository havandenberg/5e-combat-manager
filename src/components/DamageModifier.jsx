import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

export default class DamageModifier extends React.Component {
  static propTypes = {
    damageTotal: React.PropTypes.number.isRequired,
    target: React.PropTypes.object.isRequired,
    onDamageChange: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.state = {
      errors: [],
      isDouble: false,
      isHalf: false
    };
  }

  componentDidMount() {
    this.props.target.damage = this.props.damageTotal;
  }

  componentWillReceiveProps(nextProps) {
    const {isDouble, isHalf} = this.state;
    if (this.props.damageTotal !== nextProps.damageTotal) {
      this.props.target.damage = Math.floor(nextProps.damageTotal * (isDouble ? 2 : 1) * (isHalf ? 0.5 : 1));
    }
  }

  validate = () => {
    const errors = [];
    const damage = this.refs.damage.value;

    if (_.isEmpty(damage)) {
      errors.push('damageEmpty');
    } else if (!/^[0-9]\d*$/.test(damage)) {
      errors.push('damageTotalNaN');
    }

    this.setState({errors});
    return (!errors.length);
  }

  handleDamage = () => {
    const {target} = this.props;
    if (this.validate()) {
      this.props.onDamageChange({...target, damage: this.refs.damage.value});
      this.setState({isDouble: false, isHalf: false});
    }
  }

  handleDouble = () => {
    const {damageTotal, target} = this.props;
    const {isDouble} = this.state;
    if (this.validate()) {
      this.props.onDamageChange({
        ...target,
        damage: Math.floor(!isDouble ? damageTotal * 2 : damageTotal)});
      this.setState({isDouble: !isDouble, isHalf: false});
    }
  }

  handleHalf = () => {
    const {damageTotal, target} = this.props;
    const {isHalf} = this.state;
    if (this.validate()) {
      this.props.onDamageChange({
        ...target,
        damage: Math.floor(!isHalf ? damageTotal / 2 : damageTotal)});
      this.setState({isHalf: !isHalf, isDouble: false});
    }
  }

  render() {
    const {target} = this.props;
    const {isDouble, isHalf} = this.state;

    return (
      <div className="damage-modifier--container">
        <div>{target.name}</div>
        <div
          className={classNames('damage-modifier--btn', {'damage-modifier--btn-selected': isDouble})}
          onClick={this.handleDouble}>x2</div>
        <div
          className={classNames('damage-modifier--btn', {'damage-modifier--btn-selected': isHalf})}
          onClick={this.handleHalf}>1/2</div>
        <input
          className="damage-modifier--custom"
          type="text"
          value={target.damage || 0}
          onChange={this.handleDamage}
          ref="damage" />
      </div>
    );
  }

}
