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
      timeToAnswer: 5
    }
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
    console.log("Time: " + this.state.timeToAnswer);
    this.setState({
      timeToAnswer: this.state.timeToAnswer - 1
    });
    if(this.state.timeToAnswer === 0){
      clearInterval(this.timerID);
    }
  }

  render(){

    var answers = [];
    for (var i = 0; i < this.props.questions.answers.length; i++){
      answers.push(
        <Answer item={this.props.questions.answers[i]} key={i} />
      )
    }

    return(
      <div>
        <h1>A Trivia Game</h1>
        {/* <PlayArea time={this.state.timeToAnswer} questions={this.props.questions} /> */}
        <p>Time: {this.state.timeToAnswer}</p>
        <p>{this.props.questions.question}</p>
        <div className="answers">{answers}</div>
      </div>
    )
  }
}

// class PlayArea extends Component {
//   render(){
//     var answers = [];
//     for (var i = 0; i < this.props.questions.answers.length; i++){
//       answers.push(
//         <Answer item={this.props.questions.answers[i]} key={i} />
//       )
//     }

//     return(
//       <div>
//         <p>Time: {this.props.time}</p>
//         <p>{this.props.questions.question}</p>
//         <div className="answers">{answers}</div>
//       </div>
//     )
//   }
// }

class Answer extends Component {
  constructor(props){
    super(props);
    this.onAnswerClick = this.onAnswerClick.bind(this);
  }

  onAnswerClick(){
    console.log("clicked " + this.props.item);
  }

  render() {
    return(
      <div className="answer" onClick={this.onAnswerClick}>
        {this.props.item}
      </div>
    )
  }
}

export default App;
