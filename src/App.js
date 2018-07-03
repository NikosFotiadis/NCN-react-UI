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
    value2 : '', // Ungly. Used for double field forms
    accountBalance : '',
    currAccount : '',
    message : '',
    tokenPrice : ''
  };

  async componentDidMount(){
    const manager = await NCN.methods.owner().call();
    const contractName = await NCN.methods.name().call();
    var currAccount = await web3.eth.getAccounts();
    currAccount = currAccount[0];
    var accountBalance = await NCN.methods.balanceOf(currAccount).call();
    var tokenPrice = await NCN.methods.tokenPrice().call();

    // console.log('current account : '+currAccount);
    // console.log(manager);
    this.setState({ manager , contractName , currAccount, accountBalance, tokenPrice});
  }

  buy = async event => {
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

  trasferOwnership = async event => {
    event.preventDefault();

    var newOwner = this.state.value;

    this.setState({message : 'Transfering to '+ newOwner +' ...'});

    console.log(newOwner);

    await NCN.methods.transferContrac(newOwner).send({
      from : this.state.currAccount
    });

    this.setState({message : 'Transfer completed'});
  }

  changePrice = async event => {
    event.preventDefault();

    var newPrice = this.state.value;

    this.setState({message : 'Changing price to '+ newPrice +' ...'});

    await NCN.methods.setTokenPrice(newPrice).send({
      from : this.state.currAccount
    });

    this.setState({message : 'Transfer completed'});
  }

  transfer = async event => {
    event.preventDefault();

    var amount = this.state.value2;
    var to = this.state.value;

    this.setState({message : 'Trasfering ' +amount+ ' to '+ to +' ...'});

    await NCN.methods.transfer(to,amount).send({
      from : this.state.currAccount
    });

    this.setState({message : 'Transfer completed'});
  }

  chashOut = async event => {
    event.preventDefault();

    var amount = this.state.value;

    this.setState({message : 'Withdrawing '+ amount +' ...'});

    await NCN.methods.cashOut(amount).send({
      from : this.state.currAccount
    });

    this.setState({message : 'Transfer completed'});
  }

  render() {
    // web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <h2> Token manager </h2>
        <p>This token is managed by {this.state.manager} </p>

        <h2> Token name </h2>
        <p>Token name is {this.state.contractName} </p>

        <h2> Token price </h2>
        <p>Token costs {this.state.tokenPrice} wei</p>

        <h2> Account balance ({this.state.currAccount})</h2>
        <p>Account balance is {this.state.accountBalance} </p>

        <hr/>

        <form onSubmit = {this.trasferOwnership}>
          <h2> Transfer owenership (manager only) </h2>

          &nbsp;<input
            // value = {this.state.value}
            onChange = {event => this.setState({ value : event.target.value})}
          />

          <button>Trasfer</button>
        </form>

        <br/>
        <hr/>
        <br/>

        <form onSubmit = {this.changePrice}>
          <h2> Change token price (manager only) </h2>

          &nbsp; <input
            // value = {this.state.value}
            onChange = {event => this.setState({ value : event.target.value})}
          />
          <button>Submit</button>
        </form>

        <br/>
        <hr/>
        <br/>

        <form onSubmit = {this.chashOut}>
          <h2> Withdraw funds (manager only) </h2>
          Amount in wei to ithdraw
          &nbsp;<input
            // value = {this.state.value}
            onChange = {event => this.setState({ value : event.target.value})}
          />
          <button>Submit</button>
        </form>

        <br/>
        <hr/>
        <br/>

        <form onSubmit = {this.transfer}>
          <h2> Transfer NCN </h2>

          &nbsp; Address &nbsp;<input
            // value = {this.state.value}
            onChange = {event => this.setState({ value : event.target.value})}
          />
          <br/>
          &nbsp; Amount &nbsp;<input
            // value = {this.state.value}
            onChange = {event => this.setState({ value2 : event.target.value})}
          />
          <button>Submit</button>
        </form>

        <br/>
        <hr/>
        <br/>

        <form onSubmit = {this.buy}>
          <h2>Buy NCN</h2>
          Amount of wei you want to pay
          &nbsp; <input
            // value = {this.state.value}
            onChange={event => this.setState({ value : event.target.value})}
          />
          <button>Buy</button>
        </form>

        <hr/>

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
