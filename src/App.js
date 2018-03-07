import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <GameBoard questions={QUESTIONS} time={TIME} />
      </div>
    );
  }
}

class Answer extends Component {
  render() {
    return(
      <div>
        {this.props.item}
      </div>
    )
  }
}

class PlayArea extends Component {
  render(){
    var answers = [];
    for (var i = 0; i < this.props.questions.answers.length; i++){
      answers.push(
        <Answer item={this.props.questions.answers[i]} />
      )
    }
    return(
      <div>
        <p>Time: {this.props.time}</p>
        <p>{this.props.questions.question}</p>
        <div className="answers">{answers}</div>
      </div>
    )
  }
}

class GameBoard extends Component {
  render(){
    return(
      <div>
        <PlayArea time={this.props.time} questions={this.props.questions} />
      </div>
    )
  }
}

const QUESTIONS = {question: "What is my name?", answers: ["Liana", "Bob", "Sally", "Jo"], correctAnswer: "Liana"};
const TIME = 30;

export default App;
