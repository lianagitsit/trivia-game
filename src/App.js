import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const QUESTIONS = [
  {
    question: "Props are read-only",
    answers: ["True", "False"],
    correctAnswer: "True"
  },

  {
    question: "Which lifecycle hook runs after the component output has been rendered to the DOM?",
    answers: ["componentWillMount()", "componentDidUpdate()", "componentDidMount()", "render()"],
    correctAnswer: "componentDidMount()"
  },

  {
    question: "Which statement correctly binds the handleClick method?",
    answers: ["this.handleClick = this.handleClick.bind(this);", 
      "this = this.handleClick.bind(this);", 
      "this.handleClick = handleClick.bind(this);", 
      "this.handleClick = this.bind(this);"],
    correctAnswer: "this.handleClick = this.handleClick.bind(this);"
  },

  {
    question: "Which question is NOT useful in determining whether or not data is state?",
    answers: ["Is it passed in from a parent via props?", 
    "Does it remain unchanged over time?", 
    "Will it be not at all confusing to update from children to parent components?", 
    "Can you compute it based on any other state or props in your component?"],
    correctAnswer: "Will it be not at all confusing to update from children to parent components?"
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
      gameOver: false,
      timeToAnswer: 10,
      timeUntilNextQuestion: 5,
      guess: "",
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      totalUnanswered: 0,
      questionsCopy: this.props.questions.slice()
      // currentQuestion (set in getQuestion())
    }
    this.handleGuess = this.handleGuess.bind(this);
    this.start = this.start.bind(this);
    this.restart = this.restart.bind(this);
  }

  componentWillMount() {
    this.getQuestion();
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
    clearTimeout(this.outcomeTimerID);
  }

  getQuestion() {
    // A COMPONENT SHOULD NEVER MODIFY ITS OWN PROPS WHAT WAS I THINKING
    var newQuestionsCopy = this.state.questionsCopy.slice();
    var randomIndex = Math.floor(Math.random() * newQuestionsCopy.length);
    var randomQuestion = newQuestionsCopy[randomIndex];
    var gameOver = this.state.gameOver;

    console.log(randomQuestion);

    // Remove the current question from the available list
    newQuestionsCopy.splice(randomIndex, 1);

    // Reset the questions array after all questions have been asked
    if (newQuestionsCopy.length === 0 && !randomQuestion) {
      gameOver = true;
      newQuestionsCopy = this.props.questions.slice();
    }

    console.log(newQuestionsCopy);

    this.setState({
      gameOver: gameOver,
      currentQuestion: randomQuestion,
      guess: "",
      timeToAnswer: 10,
      timeUntilNextQuestion: 5,
      questionsCopy: newQuestionsCopy
    })
  }

  // QUESTION TIMER
  tick() {
    if (this.state.gameOver) {
      clearTimeout(this.timerID);
      return;
    } else if (this.state.timeToAnswer === 1) {
      this.recordResults();
      clearTimeout(this.timerID);

      this.outcomeTimerID = setTimeout(
        () => this.outcomeTick(),
        1000
      );
      //return; 
    } else if (!this.state.guess || this.state.timeToAnswer > 1) {
      this.timerID = setTimeout(
        () => this.tick(),
        1000
      );
    }

    this.setState({
      timeToAnswer: this.state.timeToAnswer - 1
    });
  }

  // OUTCOME TIMER
  outcomeTick() {
    if (this.state.gameOver) {
      clearTimeout(this.outcomeTimerID);
      return;
    } else if (this.state.timeUntilNextQuestion === 0) {
      clearTimeout(this.outcomeTimerID);

      this.getQuestion();

      this.timerID = setTimeout(
        () => this.tick(),
        1000
      );

    } else if (this.state.guess || this.state.timeToAnswer === 0) {

      this.outcomeTimerID = setTimeout(
        () => this.outcomeTick(),
        1000
      );

      this.setState({
        timeUntilNextQuestion: this.state.timeUntilNextQuestion - 1
      });
    }
  }

  // PLAY AGAIN
  restart(gameOn) {
    this.timerID = setTimeout(
      () => this.tick(),
      1000
    );

    this.getQuestion();

    this.setState({
      gameOn: gameOn,
      gameOver: false,
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      totalUnanswered: 0,
    })
  }

  // GAME START
  start() {
    this.timerID = setTimeout(
      () => this.tick(),
      1000
    );

    this.setState({
      gameOn: true
    })
  }

  recordResults() {
    var guessedRight = 0;
    var guessedWrong = 0;
    var noGuess = 0;

    if (!this.state.guess) {
      noGuess++;
    } else if (this.state.guess === this.state.currentQuestion.correctAnswer) {
      guessedRight++;
    } else {
      guessedWrong++;
    }

    this.setState({
      totalCorrectAnswers: this.state.totalCorrectAnswers + guessedRight,
      totalIncorrectAnswers: this.state.totalIncorrectAnswers + guessedWrong,
      totalUnanswered: this.state.totalUnanswered + noGuess
    });

  }

  // Handles guess data from Answer component
  handleGuess(guess) {
    clearTimeout(this.timerID);

    this.outcomeTimerID = setTimeout(
      () => this.outcomeTick(),
      1000
    );

    this.setState(
      { guess: guess },
      () => this.recordResults() 
    );
  };

  render() {

    var display;
    var timeRemaining = (<p>Time remaining: {this.state.timeToAnswer} seconds</p>);

    if (!this.state.gameOn && !this.state.gameOver) {
      timeRemaining = false;
      display = (<button onClick={this.start}>Start</button>);
    } else if (this.state.gameOver) {
      display = (
        <GameResults
          totalCorrectAnswers={this.state.totalCorrectAnswers}
          totalIncorrectAnswers={this.state.totalIncorrectAnswers}
          totalUnanswered={this.state.totalUnanswered}
          onRestart={this.restart}
        />
      )
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
          timeTilNext={this.state.timeUntilNextQuestion}
        />
      )
    }

    return (
      <div>
        <h1>A Trivia Game</h1>
        {timeRemaining}
        {display}
      </div>
    )
  }
}

class GameResults extends Component {
  constructor(props) {
    super(props);
    this.restart = this.restart.bind(this);
  }

  restart(event) {
    this.props.onRestart(event.target.getAttribute("data-game-on"));
  }

  render() {
    return (
      <div>
        <h2>Game over!</h2>
        <p>Correct answers: {this.props.totalCorrectAnswers}</p>
        <p>Incorrect answers: {this.props.totalIncorrectAnswers}</p>
        <p>Unanswered: {this.props.totalUnanswered}</p>
        <button data-game-on="true" onClick={this.restart}>Play again?</button>
      </div>
    )
  }
}

class Outcome extends Component {

  render() {
    var message;
    var correctAnswer = (<p>The correct answer is {this.props.correctAnswer}!</p>);
    var timeTilNext = (<p>Next question in: {this.props.timeTilNext} seconds</p>);

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
        {timeTilNext}
        {message}
        {correctAnswer}
        <Gif />
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
  }

  render() {
    return (
      <div className="Answer" onClick={this.handleGuess}>
        {this.props.item}
      </div>
    )
  }
}

class Gif extends Component {
  constructor(props){
    super(props);
    this.state = {
      gifURL: ""
    }
  }

  componentWillMount() {
    var searchTerm = "confused";
    fetch("http://api.giphy.com/v1/gifs/random?api_key=CymhH6SlUPj3Xk8g8Y115zIFK0lyCDhV&limit=1&tag=" + searchTerm)
    .then(response => response.json())
    .then(results => {
      console.log(results);
      this.setState({gifURL: results.data.images.fixed_height.url})
    })
  }

  render(){
  var myGif = this.state.gifURL? (<img src={this.state.gifURL} />) : false
    return(
      <div>
        {myGif}
      </div>
    )
  }
}

export default App;


//TODO: Let users enter their own questions and answers. 