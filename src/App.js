import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
  },

  {
    question: "What is the meaning of life?",
    answers: [10, 46, 42, 1],
    correctAnswer: 42
  },

  {
    question: "So long and thanks for all the...",
    answers: ["waffles", "bananas", "helicopters", "fish"],
    correctAnswer: "fish"
  }
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to A Trivia Game</h1>
        </header>
        <GameBoard questions={QUESTIONS} />
      </div>
    );
  }
}

class GameBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameOn: false,
      timeToAnswer: 5,
      timeUntilNextQuestion: 5,
      guess: "",
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      totalUnanswered: 0
      // currentQuestion (set in getQuestion())
    }
    this.handleGuess = this.handleGuess.bind(this);
    this.start = this.start.bind(this);
  }

  // Generate a random question at startup
  componentWillMount() {
    this.getQuestion();
  }

  // componentWillUpdate() {
  //   if (this.state.timeUntilNextQuestion === 0){
  //     this.getQuestion();
  //   }
  // }

  componentDidUpdate() {

    // Once the outcome timer is up, stop it and generate a new question
    if (this.state.timeUntilNextQuestion === -1){
      clearTimeout(this.outcomeTimerID);
      this.getQuestion();
    
    // If the user makes a guess or they run out of time, 
    // stop the question timer and start the outcome timer
    } else if (this.state.guess || this.state.timeToAnswer === 0) {
      clearTimeout(this.timerID);
      this.outcomeTimerID = setTimeout(
        () => this.outcomeTick(),
        1000
      );

    // If the user hasn't guessed yet and there's still time to guess, 
    // keep the question timer running
    } else if (!this.state.guess || this.state.timeToAnswer > 0){
      this.timerID = setTimeout(
        () => this.tick(),
        1000
      );
    }
}

  componentWillUnmount() {
    clearTimeout(this.timerID);
    clearTimeout(this.outcomeTimerID);
  }

  getQuestion() {
    var randomIndex = Math.floor(Math.random() * this.props.questions.length);
    var randomQuestion = this.props.questions[randomIndex];

    console.log(randomQuestion);

    // Modify questions array in place to remove the current question
    this.props.questions.splice(randomIndex, 1);

    // if (this.props.questions.length === 0){
    //   return false;
    // }

    console.log(this.props.questions);

    // Sets the current question, clears guess and resets timeToAnswer and timeUntilNextQuestion
    this.setState({
      currentQuestion: randomQuestion,
      guess: "",
      timeToAnswer: 5,
      timeUntilNextQuestion: 5
    })
  }

  outcomeTick() {
    this.setState({
      timeUntilNextQuestion: this.state.timeUntilNextQuestion - 1
    });
  }

  start() {
    this.setState({
      gameOn: true
    })
  }

  tick() {
    this.setState({
      timeToAnswer: this.state.timeToAnswer - 1
    });
  }

  handleGuess(guess) {
    this.setState({
      guess: guess
    });
  };

  render() {
    console.log("Guess: " + this.state.guess);
    console.log("Time to answer: " + this.state.timeToAnswer);
    console.log("Time until next: " + this.state.timeUntilNextQuestion);

    var display;
    var timeRemaining = (<p>Time: {this.state.timeToAnswer}</p>);
    var timeTilNext = (<p>Next question in: {this.state.timeUntilNextQuestion}</p>);
    if (!this.state.gameOn) {
      timeRemaining = false;
      timeTilNext = false;
      display = (<button onClick={this.start}>Start</button>);
    } else if (!this.state.guess && this.state.timeToAnswer > 0) {
      display = (
        <Question
          currentQuestion={this.state.currentQuestion}
          onUserGuess={this.handleGuess}
        />
      )
    } else if (this.state.guess || this.state.timeToAnswer === 0) {
      display = (
        <Outcome
          guess={this.state.guess}
          correctAnswer={this.state.currentQuestion.correctAnswer}
          timeToAnswer={this.state.timeToAnswer}
        />
      )
    } 
    
    // else if(){
    //   display = (
    //     <GameResults 
    //       totalCorrectAnswers={this.state.totalCorrectAnswers}
    //       totalIncorrectAnswers={this.state.totalIncorrectAnswers}
    //       totalUnanswered={this.state.totalUnanswered}
    //     />
    //   )
    // }

    return (
      <div>
        <h1>A Trivia Game</h1>
        {timeRemaining}
        {timeTilNext}
        {display}
      </div>
    )
  }
}

// class GameResults extends Component {
//   render(){
//     return(
//       <div>
//         <h2>Game over!</h2>
//         <p>Correct answers: {this.props.totalCorrectAnswers}</p>
//         <p>Incorrect answers: {this.props.totalIncorrectAnswers}</p>
//         <p>Unanswered: {this.props.totalUnanswered}</p>
//       </div>
//     )
//   }
// }

class Outcome extends Component {
  render() {
    var message;
    var correctAnswer = (<p>The correct answer is {this.props.correctAnswer}!</p>);
    if (this.props.timeToAnswer === 0) {
      message = (<h3>Time's Up!</h3>);
    } else if (this.props.guess === this.props.correctAnswer) {
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
    for (var i = 0; i < this.props.currentQuestion.answers.length; i++) {
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
  constructor(props) {
    super(props);
    this.handleGuess = this.handleGuess.bind(this);
  }

  handleGuess(event) {
    this.props.onUserGuess(event.target.textContent);
    // console.log("Clicked " + event.target.textContent);
  }

  render() {
    return (
      <div className="Answer" onClick={this.handleGuess}>
        {this.props.item}
      </div>
    )
  }
}

export default App;


//TODO: Let users enter their own questions and answers. 