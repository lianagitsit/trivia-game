import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const QUESTIONS = {question: "What is my name?", answers: ["Liana", "Bob", "Sally", "Jo"], correctAnswer: "Liana"};
// const TIME = 30;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <GameBoard questions={QUESTIONS} />
      </div>
    );
  }
}

class GameBoard extends Component {
  constructor(props){
    super(props);
    this.state = {
      timeToAnswer: 5,
      // guess: ''
    }

    this.handleGuess = this.handleGuess.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    // console.log("Time: " + this.state.timeToAnswer);
    this.setState({
      timeToAnswer: this.state.timeToAnswer - 1
    });
    if(this.state.timeToAnswer === 0){
      clearInterval(this.timerID);
    }
  }

  handleGuess(guess){
    this.setState({
      guess: guess
    });
  };

  render(){
    console.log("Guess: " + this.state.guess);

    var answers = [];
    for (var i = 0; i < this.props.questions.answers.length; i++){
      answers.push(
        <Answer 
          item={this.props.questions.answers[i]} 
          key={i}
          onUserGuess={this.handleGuess}
        />
      )
    }

    return(
      <div>
        <h1>A Trivia Game</h1>
        <p>Time: {this.state.timeToAnswer}</p>
        <p>{this.props.questions.question}</p>
        <div className="answers">{answers}</div>
      </div>
    )
  }
}

class Answer extends Component {
  constructor(props){
    super(props);
    this.handleGuess = this.handleGuess.bind(this);
  }

  handleGuess(event){
    this.props.onUserGuess(event.target.textContent);
    console.log("Clicked " + event.target.textContent);
  }

  render() {
    return(
      <div className="answer" onClick={this.handleGuess}>
        {this.props.item}
      </div>
    )
  }
}

export default App;
