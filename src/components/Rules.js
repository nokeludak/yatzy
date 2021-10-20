
 class Rule {
    constructor(params) {
      // put all properties in params on instance
      Object.assign(this, params);
    }
  
    sum(dice) {
      // sum of all dice
      return dice.reduce((prev, curr) => prev + curr);
    }
  
    freq(dice) {
      // frequencies of dice values
      const freqs = new Map();
      for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
      return Array.from(freqs.values());
    }
  
    count(dice, val) {
      // # times val appears in dice
      return dice.filter(d => d === val).length;
    }
  }
  
  /** Given a sought-for val, return sum of dice of that val.
   *
   * Used for rules like "sum of all ones"
   */
  
  class TotalOneNumber extends Rule {
    evalRoll = dice => {
      return this.val * this.count(dice, this.val);
    };
  }
  
  /** Given a required # of same dice, return sum of all dice.
   *
   * Used for rules like "sum of all dice when there is a 3-of-kind"
   */
  
  class SumDistro extends Rule {
    evalRoll = dice => {
      // do any of the counts meet of exceed this distro?
      return this.freq(dice).some(c => c >= this.count) ? this.sum(dice) : 0;
    };
  }
  
  /** Check if full house (3-of-kind and 2-of-kind) */
  
  class FullHouse extends Rule {
    evalRoll = dice => {
      const freqs = this.freq(dice);
      return freqs.includes(2) && freqs.includes(3) ? this.score : 0;
    };
  }
  
  /** Check for small straights. */
  
  class SmallStraight extends Rule {
    evalRoll = dice => {
      const d = new Set(dice);
      // straight can be 234 + either 1 or 5
      if (
        (d.has(2) && d.has(3) && d.has(4) && d.has(5) && d.has(2)) ||
        d.has(5)
      ) {
        return this.score;
      }
  
      // or 345 + either 2 or 6
      if ((d.has(3) && d.has(4) && d.has(5) && d.has(2)) || d.has(6)) {
        return this.score;
      }
  
      return 0;
    };
  }
  
  /** Check for large straights. */
  
  class LargeStraight extends Rule {
    evalRoll = dice => {
      const d = new Set(dice);
  
      // large straight must be 5 different dice & only one can be a 1 or a 6
      return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
    };
  }
  
  /** Check if all dice are same. */
  
  class Yahtzee extends Rule {
    evalRoll = dice => {
      // all dice must be the same
      return this.freq(dice)[0] === 5 ? this.score : 0;
    };
  }
  
  // ones, twos, etc score as sum of that value
  const ones = new TotalOneNumber({ val: 1, description: 'Score 1 for every 1' });
  const twos = new TotalOneNumber({ val: 2, description: 'Score 2 for every 2' });
  const threes = new TotalOneNumber({ val: 3, description: 'Score 3 for every 3' });
  const fours = new TotalOneNumber({ val: 4, description: 'Score 4 for every 4' });
  const fives = new TotalOneNumber({ val: 5, description: 'Score 5 for every 5' });
  const sixes = new TotalOneNumber({ val: 6, description: 'Score 6 for every 6' });
  
  // three/four of kind score as sum of all dice
  const threeOfKind = new SumDistro({
    count: 3,
    description: 'If 3+ of one value, score sum of all dice (otherwise,score 0)'
  });
  const fourOfKind = new SumDistro({
    count: 4,
    description: 'If 4+ of one value, score sum of all dice (otherwise,score 0)'
  });
  
  // full house scores as flat 25
  const fullHouse = new FullHouse({
    score: 25,
    description: 'If 3 of one value and 2 of another,score 25 (else 0)'
  });
  
  // small/large straights score as 30/40
  const smallStraight = new SmallStraight({
    score: 30,
    description: 'If 4+ values in a row, score 30 (else 0)'
  });
  const largeStraight = new LargeStraight({
    score: 40,
    description: 'If 5 values in a row, score 40 (else 0)'
  });
  
  // yahtzee scores as 50
  const yahtzee = new Yahtzee({
    score: 50,
    description: 'If all values match, score 50 (else 0)'
  });
  
  // for chance, can view as some of all dice, requiring at least 0 of a kind
  const chance = new SumDistro({ count: 0, description: 'Score sum of all dice' });
  
  export {
    ones,
    twos,
    threes,
    fours,
    fives,
    sixes,
    threeOfKind,
    fourOfKind,
    fullHouse,
    smallStraight,
    largeStraight,
    yahtzee,
    chance
  };