import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const winpos = props.winnerPos
  return (
    <button onClick={props.onClick} className={winpos.indexOf(props.k) !== -1  ? "square win" : "square" }>
      {props.value}
    </button>
  );
}

function Board(props) {
  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        k ={i}
        winnerPos={props.winnerPos}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }

  const temp = [0, 1, 2];

  return (
    <div>
      {
        temp.map(i =>
        (
          <div key={i + "abc"} className="board-row">
            {
              temp.map(j => renderSquare(3 * i + j))
            }
          </div>
        )
        )
      }
    </div>
  );
}

function Game(props) {

  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      latestCheck:[]
      
    }
  ])

  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setXIsNext] = useState(true)
  const [selectedItem, setSelectedItem] = useState(0)
  const [sortBy, setSortBy] = useState(true);
  const [winnerPos, setWinnerPos] = useState([])

  const handleClickSortBy = () => {
    setSortBy(!sortBy)
  }

  const handleClick = (i) => {
    const historyTemp = history.slice(0, stepNumber + 1);
    const current = historyTemp[historyTemp.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(historyTemp.concat([
      {
        squares: squares,
        latestCheck: [i%3, Math.floor(i/3)],
        winnerPos: []
      }
    ]))
    setStepNumber(historyTemp.length);
    setXIsNext(!xIsNext)
    setSelectedItem(selectedItem+1)
    
  }

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0)
  }

  const handleSelectItem = (i) => {
    jumpTo(i);
    setSelectedItem(i);
    setWinnerPos([]);
  }

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);


  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move + ". Position :(" + step.latestCheck.toString() + ")":
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => { handleSelectItem(move) }} className={selectedItem === move ? "bold-text" : ""}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner[0];
    if(winnerPos.length===0)
    {
      setWinnerPos(winner[1]);
    }
  } else {
    if(history.length<=9) status = "Next player: " + (xIsNext ? "X" : "O");
    else status = "The game result is a draw ";
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          winnerPos= {winnerPos}
          onClick={i => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <button onClick={handleClickSortBy}>{sortBy ? "Ascending" : "Descending"}</button>
        <div>{status}</div>
        <ol>{sortBy ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      
      return [squares[a],lines[i]];
    }
  }
  return null;
}
