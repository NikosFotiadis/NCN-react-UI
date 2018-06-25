import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3'
import NCN from './ERC20_NCN'

class App extends Component {
  state = {
    manager : 'unset',
    contractName : 'unset',
    value : '',
    accountBalance : '',
    currAccount : '',
    message : ''
  };

  async componentDidMount(){
    const manager = await NCN.methods.owner().call();
    const contractName = await NCN.methods.name().call();
    var currAccount = await web3.eth.getAccounts();
    currAccount = currAccount[0];
    var accountBalance = await NCN.methods.balanceOf(currAccount).call();

    // console.log('current account : '+currAccount);
    // console.log(manager);
    this.setState({ manager , contractName , currAccount, accountBalance});
  }

  onSubmit = async event => {
    event.preventDefault();

    // const accounts = await web3.eth.getAccounts();

    this.setState({message : 'Waiting on transaction...'});

    // console.log();

    await web3.eth.sendTransaction({
      from : this.state.currAccount,
      to : NCN.options.address,
      value : this.state.value
    });

    this.setState({message : 'Transaction completed'});

    var accountBalance = await NCN.methods.balanceOf(this.state.currAccount).call();
    this.setState({
      accountBalance : accountBalance
    });

  }
  render() {
    // web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <h2> Token manager </h2>
        <p>This token is managed by {this.state.manager} </p>

        <h2> Token name </h2>
        <p>Token name is {this.state.contractName} </p>

        <h2> Account balance ({this.state.currAccount})</h2>
        <p>Account balance is {this.state.accountBalance} </p>

        <hr/>

        <form onSubmit = {this.onSubmit}>
          <label>Buy NCN</label>

          <input
            value = {this.state.value}
            onChange={event => this.setState({ value : event.target.value})}
          />
          wei
          <br/>
          <button>Buy</button>
        </form>

        <hr/>

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
