import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const QUESTIONS = {question: "What is my name?", answers: ["Liana", "Bob", "Sally", "Jo"], correctAnswer: "Liana"};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <GameBoard questions={QUESTIONS} outcomes={OUTCOMES} />
      </div>
    );
  }
}

class GameBoard extends Component {
  constructor(props){
    super(props);
    this.state = {
      timeToAnswer: 5,
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
    console.log(this.state.timeToAnswer);

    var display;
    if (!this.state.guess && this.state.timeToAnswer > 0){
      display = (
        <Question 
          questions={this.props.questions} 
          onUserGuess={this.handleGuess} 
        />
      )
    } else if (this.state.guess || this.state.timeToAnswer === 0){
      clearInterval(this.timerID);
      display = (
        <Outcome 
          guess={this.state.guess} 
          correctAnswer={this.props.questions.correctAnswer} 
          timeToAnswer={this.state.timeToAnswer} 
        />
      )
    }

    return(
      <div>
        <h1>A Trivia Game</h1>
        <p>Time: {this.state.timeToAnswer}</p>
        {display}
      </div>
    )
  }
}

class Outcome extends Component {
  render(){
    var message;
    var correctAnswer = (<p>The correct answer is {this.props.correctAnswer}!</p>);
    if (this.props.timeToAnswer === 0){
      message = (<h3>Time's Up!</h3>);
    } else if (this.props.guess === this.props.correctAnswer){
      message = (<h3>Correct!</h3>);
      correctAnswer = false;
    } else {
      message = (<h3>Nope!</h3>);
    }

    return (
      <div>
        {message}
        {correctAnswer}
      </div>
    )
  }
}

// Change this to a simple function since it doesn't have state?
class Question extends Component {
  render() {
    var answers = [];
    for (var i = 0; i < this.props.questions.answers.length; i++){
      answers.push(
        <Answer 
          item={this.props.questions.answers[i]} 
          key={i}
          onUserGuess={this.props.onUserGuess}
        />
      )
    }

    return (
      <div>
        <p>{this.props.questions.question}</p>
        <div className="Answers">{answers}</div>
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
      <div className="Answer" onClick={this.handleGuess}>
        {this.props.item}
      </div>
    )
  }
}

export default App;
