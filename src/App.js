import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// const QUESTIONS = {
//   question: "What is my name?", 
//   answers: ["Liana", "Bob", "Sally", "Jo"], 
//   correctAnswer: "Liana"
// };

const QUESTIONS = [
  {
    question: "What is my name?", 
    answers: ["Liana", "Bob", "Sally", "Jo"], 
    correctAnswer: "Liana"
  },

  {
    question: "What is my favorite color?",
    answers: ["brown", "green", "pink", "puce"],
    correctAnswer: "green"
  }
];

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
      gameOn: false,
      timeToAnswer: 5,
      timeUntilNextQuestion: 5,
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      totalUnanswered: 0
    }
    this.handleGuess = this.handleGuess.bind(this);
    this.start = this.start.bind(this);
  }

  // Generate a random question at startup
  componentWillMount() {
    this.getQuestion();
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

  getQuestion(){
    var randomQuestion;
    randomQuestion = this.props.questions[Math.floor(Math.random() * this.props.questions.length)];
    this.setState({
      currentQuestion: randomQuestion
    })
  }

  start(){
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );

    this.setState({
      gameOn: true
    })
  }

  render(){
    console.log("Guess: " + this.state.guess);
    console.log(this.state.timeToAnswer);

    var display;
    var timeRemaining = (<p>Time: {this.state.timeToAnswer}</p>);
    if (!this.state.gameOn){
      timeRemaining = false;
      display = (<button onClick={this.start}>Start</button>);
    } else if (!this.state.guess && this.state.timeToAnswer > 0){
      display = (
        <Question 
          currentQuestion={this.state.currentQuestion} 
          onUserGuess={this.handleGuess}
        />
      )
    } else if (this.state.guess || this.state.timeToAnswer === 0){
      clearInterval(this.timerID);
      display = (
        <Outcome 
          guess={this.state.guess} 
          correctAnswer={this.state.currentQuestion.correctAnswer} 
          timeToAnswer={this.state.timeToAnswer}
        />
      )
    }

    return(
      <div>
        <h1>A Trivia Game</h1>
        {timeRemaining}
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
    for (var i = 0; i < this.props.currentQuestion.answers.length; i++){
      answers.push(
        <Answer 
          item={this.props.currentQuestion.answers[i]} 
          key={i}
          onUserGuess={this.props.onUserGuess}
        />
      )
    }

    return (
      <div>
        <p>{this.props.currentQuestion.question}</p>
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


//TODO: Let users enter their own questions and answers. 