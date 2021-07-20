import React, { Component } from 'react';
import { Navbar, Alert, Row, Col, Container, Form, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Web3 from 'web3';
import Color from './abis/Color.json';
import ColorCard from './Components/ColorCard.js'

export default class App extends Component {
  
  constructor(props){
    super(props);
    this.state = { colors : [], current: ''};
  }
  
  async componentWillMount(){
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  loadWeb3 = async() => {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else{
      window.alert('Try with Metamask!');
    }
  }

  loadBlockChainData = async() => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if(networkId){
      const abi = Color.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({totalSupply});
      for(let i = 1; i <= totalSupply; i++){
        const color = await contract.methods.colors(i-1).call();
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
      console.log(this.state.colors);
    }else{
      window.alert('Smart Contract not deployed');
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({current: e.target.value});
  }


  mint = (color) => {
    this.state.contract.methods.mint(color).send({from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })  
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.mint(this.state.current);
  }

  render() {
    return (
        <>
      <Navbar>
        <Container>
          <Navbar.Brand href="#home">Crypto Colors</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Your Account: {this.state.account}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Alert variant= 'warning' style = {{textAlign : 'center'}} > 
          If You want to Change Accounts. You have to Switch to a different Account and then refresh the page!!
      </Alert>

      {/* form */}

      <Form style = {{marginBottom : '80px'}} onSubmit = {this.handleSubmit}>
        <Row>
        <Col xs = {4}></Col>
        <Col xs = {3}>  
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Enter Your Color</Form.Label>
          <Form.Control type="text" placeholder="#FFFFFF" onChange={this.handleChange} />
        </Form.Group>
        </Col>
        <Col xs = {2} style = {{paddingTop: '30px'}}>
        <Button type="submit">
          MINT
        </Button>
        </Col>
        </Row>
      </Form>



      {/* Colors */}
      
      
      <Container>
        {/* dummy */}
        <Row>
        {["#CD113B" ,"#FFA900" ,"#053742"].map(color => {
        return(
          <>
            <Col xs= {4}>
              <ColorCard key = {color} Name = {color} />
            </Col>
          </>
          )
        })}
        </Row>

        {/* real */}
        <Row>
        {this.state.colors.map((color, id) => {
        return(
          <>
            <Col xs= {4}>
              <ColorCard key = {color} Name = {color} />
            </Col>
          </>
          )
        })}
        </Row>
      </Container>
      </>
    )
  }
}