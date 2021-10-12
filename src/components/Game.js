import React, { useEffect, useState } from 'react';
import Dice from './Dice';


import ScoreTable from './ScoreTable';

const NUM_DICE = 5;
const NUM_ROLLS = 2;

function Game() {
  const [gameState, setGameState] = useState({
    dice: Array.from({ length: NUM_DICE }),
    locked: Array(NUM_DICE).fill(false),
    rollsLeft: NUM_ROLLS,
    rolling: false,
    scores: {
      ones: undefined,
      twos: undefined,
      threes: undefined,
      fours: undefined,
      fives: undefined,
      sixes: undefined,
      threeOfKind: undefined,
      fourOfKind: undefined,
      fullHouse: undefined,
      smallStraight: undefined,
      largeStraight: undefined,
      yahtzee: undefined,
      chance: undefined
    }
  });
  const [counter, setCounter] = useState(0)
  function roll(event) {
    
    setGameState(gs => ({
      ...gameState,
      dice: gs.dice.map((d, i) =>
        gs.locked[i] ? d : Math.ceil(Math.random() * 6)
      ),
      locked: gs.rollsLeft > 1 ? gs.locked : Array(NUM_DICE).fill(true),
      rollsLeft: gs.rollsLeft > 0 ? gs.rollsLeft - 1 : 0,
      rolling: false
    }));
  }

  function animateRoll() {
    setGameState(() => ({
      ...gameState,
      rolling: true
    }));
    setTimeout(roll, 1000);
  }

  const resetHandler = () => {
  setGameState({
  dice: Array.from({ length: NUM_DICE }),
    locked: Array(NUM_DICE).fill(false),
    rollsLeft: NUM_ROLLS,
    rolling: false,
    scores: {
      ones: undefined,
      twos: undefined,
      threes: undefined,
      fours: undefined,
      fives: undefined,
      sixes: undefined,
      threeOfKind: undefined,
      fourOfKind: undefined,
      fullHouse: undefined,
      smallStraight: undefined,
      largeStraight: undefined,
      yahtzee: undefined,
      chance: undefined
  },
});
  setCounter(0);
  };
  function toggleLocked(idx) {
    

    if (gameState.rollsLeft > 0 && !gameState.rolling) {
      setGameState(gs => ({
        ...gameState,
        locked: [
          ...gs.locked.slice(0, idx),
          !gs.locked[idx],
          ...gs.locked.slice(idx + 1)
        ]
      }));
    }
  }
    
  function doScore(ruleName, ruleFn) {
    
    setGameState(gs => ({
      ...gameState,
      scores: { ...gs.scores, [ruleName]: ruleFn(gameState.dice) },
      rollsLeft: NUM_ROLLS,
      locked: Array(NUM_DICE).fill(false)
      
    }));
    setCounter(counter +1);
   
  }
  useEffect(() => {
    if (counter === 13) {
      setGameState((gs) => ({
        ...gameState,
        rollsLeft: 0,

      }));
  }
}, [counter]);

  function displayRollInfo() {
    const messages = [
      '0 Rolls Left',
      '1 Roll Left',
      '2 Rolls Left',
      'Starting Round'
    ];
    return messages[gameState.rollsLeft];
  }

  return (
    <div className='Game'>
      <header className='header'>
        <h1 className='title'>
          Yatzy <i className='fas fa-dice-six'></i>
        </h1>
        <section className='dice-section'>
          <Dice
            dice={gameState.dice}
            locked={gameState.locked}
            handleClick={toggleLocked}
            disabled={gameState.rollsLeft === 0}
            rolling={gameState.rolling}
          />
          <div className='button-wrapper'>
            <button
              disabled={
                gameState.locked.every(x => x) ||
                gameState.rollsLeft === 0 ||
                gameState.rolling
              }
              onClick={animateRoll}
              className='reroll'
            >
              {displayRollInfo()}
            </button>
          </div>
        </section>
      </header>
      <ScoreTable doScore={doScore} scores={gameState.scores} />
      {counter === 13 ? (
        <button className="reset" onClick={resetHandler}>Play Again</button>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Game;