import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
    // purpose : Rewrite Board to use two loops to make the squares instead of hardcoding them.
    renderBoard(size){
      const board = [];
      for(let i=0;i<size;i++){
        let row =[];
        for(let j=0;j<size;j++){
          row.push(this.renderSquare(i*size + j));
        }
        board.push(
          <div key={i} className="board-row">
            {row}
          </div>
        )
      }
      return board;
    }
  
    render() {
      return (
        <div>
          {this.renderBoard(3)}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber:0,
        xIsNext: true,
      };
    }
  
    handleClick(i) {
      //Display of moves as (col, row) in history. 
      const locations = [
        [1,1],
        [1,2],
        [1,3],
        [2,1],
        [2,2],
        [2,3],
        [3,1],
        [3,2],
        [3,3]
      ];
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          location : locations[i]
        }]),
        stepNumber:history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step%2)==0,
        })
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + " & (" + history[move].location + ')' :
          'Go to game start';
          //Bold the currently selected item in the move list
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{move == this.state.stepNumber?<b>{desc}</b> : desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  