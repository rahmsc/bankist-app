'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1 + ' '
    }${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= i;
    })
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

// EVENT HANDLERS
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI & Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// Transfer Funds
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// Request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// //CODING CHALLENGE #1

// //Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// //Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];
// // const dogsJulia = [9, 16, 6, 8, 3];
// // const dogsKate = [10, 5, 6, 1, 4];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const newDogsJulia = dogsJulia.slice(1, 3);
//   // const newDogsJulia = dogsJulia.slice();
//   // newDogsJulia.splice(0,1);
//   // newDogsJulia.splice(-2);
//   const newDogsAll = newDogsJulia.concat(dogsKate);

//   newDogsAll.forEach(function (mov, i) {
//     if (mov >= 3) {
//       console.log(`Dog Number ${i + 1} is an adult, and is ${mov} years old`);
//     } else {
//       console.log(`Dog Number ${i + 1} is still a puppy`);
//     }
//   });
// };

// checkDogs(dogsJulia, dogsKate);

// CODING CHALLENGE 2

// TEST DATA
// Data1:[5,2,4,1,15,8,3]
// Data2:[16,6,10,5,6,1,4]

//ifthedogis <= 2 years old, humanAge = 2 * dogAge.
// If the dog is > 2 years old, humanAge = 16 + dogAge * 4

// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);
//   const adultDogs = humanAges.filter(age => age >= 18);
//   console.log(adultDogs);
//   const averageAge =
//     // adultDogs.reduce((acc, cur) => acc + cur, 0) / adultDogs.length;
//     adultDogs.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//   return averageAge;
// };
// const avg1 = calcAverageHumanAge(data1);
// const avg2 = calcAverageHumanAge(data2);

// console.log(avg1, avg2);

// CODING CHALLENGE 3

// TEST DATA
// Data1:[5,2,4,1,15,8,3]
// Data2:[16,6,10,5,6,1,4]

// const data = [5, 2, 4, 1, 15, 8, 3];
// // const data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// // const avg2 = calcAverageHumanAge(data2);

// console.log(calcAverageHumanAge(data));

// CODING CHALLENGE 4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
//const recommendedFood = weight ** 0.75 * 28
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
if (
  dogSarah.curFood > dogSarah.recFood
    ? console.log(`Sarah's Dog is eating too much`)
    : console.log(`Sarah's dog is not eating enough`)
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.
// "Matilda and Alice and Bob's dogs eat too much!"
// "Sarah and John and Michael's dogs eat too little!"
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6.
console.log(
  dogs.some(
    dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
  )
);

// 7.
console.log(
  dogs.filter(
    dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
  )
);

// 8.
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1)); // Always last IMPORTANT
// console.log(arr.slice(1, -2));
// console.log(arr.slice());

// // SPLICE (MUTATES)
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE (MUTATES)
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT

// const letters = arr.concat(arr2);
// console.log(letters);

// // JOIN

// console.log(letters.join('-'));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// //   if (movement > 0) {
// //     console.log(`You deposited ${movement}`);
// //   } else {
// //     console.log(`You withdrawl ${Math.abs(movement)}`);
// //   }
// // }

// // console.log(`-------- FOR EACH --------`);

// // movements.forEach(function (movement) {
// //   if (movement > 0) {
// //     console.log(`You deposited ${movement}`);
// //   } else {
// //     console.log(`You withdrawl ${Math.abs(movement)}`);
// //   }
// // });

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrawl ${Math.abs(movement)}`);
//   }
// }

// console.log(`-------- FOR EACH --------`);

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrawl ${Math.abs(mov)}`);
//   }
// });

// /// MAP METHOD WITH ARRAYS

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // CONVERT FROM EUR TO USD

// const eurToUsd = 1.1;

// // const movementsUSD = movements.map(function (mov) {
// //   return mov * eurToUsd;
// // });
// // SIMPLIFIED WITH ARROW FUNCTION LEARN IMPORTANT
// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// // EXAMPLE 2

// const movementsDescrip = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescrip);

// //// FILTER METHOD FOR ARRAYS LEARN IMPORTANT

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);

// console.log(withdrawals);

// // REDUCE METHOD WITH ARRAYS

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // acc = accumulator ---> is like a snowball IMPORTANT
// // const balance = movements.reduce(function (acc, current, i, arr) {
// //   console.log(`Iteration ${i}: ${acc}`);
// //   return acc + current;
// // }, 0);

// const balance = movements.reduce((acc, current) => acc + current, 0);

// console.log(balance);

// // Maximum value

// const maxValue = movements.reduce(
//   (acc, current) => (acc < current ? current : acc),
//   movements[0]
// );

// console.log(maxValue);

// THE MAGIC OF CHAINING METHOD LEARN

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;

// // PIPELINE

// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

/////// THE FIND METHOD

// const firstWithdrawal = movements.find(mov => mov < 0);

// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// //// SOME AND EVERY LEARN

// console.log(movements);

// // EQUALITY
// console.log(movements.includes(-130));

// // SOME: SPECIFIC CONDITION
// console.log(movements.some(mov => mov === -130)); // BEtter practise is to use includes

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Seperate Callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// // FLAT AND FLATMAP

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat()); // only goes 1 level deep

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// // FLAT
// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// // FLATMAP
// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements) // Only goes 1 level deep
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// SORTING ARRAYS

// STRING
// const owners = ['Jonas', 'Zac', 'Adam', 'Marhta'];
// console.log(owners.sort()); // MUTATES ARRAY

// // NUMBERS
// console.log(movements);
// // console.log(movements.sort()); // Only works with strings

// // return < 0 , A , B (keep order)
// // return > 0 , B , A (switch order)
// // SORT METHOD LOOPS OVER ARRAY
// // ASCENDING
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (b > a) return -1;
// // });
// // BETTER WAY TO WRITE THIS
// movements.sort((a, b) => a - b);
// console.log(movements);

// // DESCENDING
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (b > a) return 1;
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);

// // Dont use sort method for mixed arrays (numbers + strings)

// // MORE WAYS OF CREATING AND FILLING ARRAYS

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // Empty arrays + Fill Methods
// const x = new Array(7); // When array is only passed 1 arguement, creates empty array.
// console.log(x);
// // console.log(x.map(() => 5)); DOESNT WORK
// //x.fill((1)); // Mutates underlying array
// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// // Array.from method
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const diceRolls = Array.from(
//   { length: 100 },
//   () => Math.floor(Math.abs(Math.random() * 6)) + 1
// );
// // console.log(diceRolls);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });

// // ARRAY PRACTISE METHODS

// // 1.
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, cur) => acc + cur, 0);

// console.log(bankDepositSum);

// // 2.
// // const numDeposits1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov >= 1000).length;
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

// console.log(numDeposits1000);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       //cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur); // Nothing wrong with using this method
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums; // {} means you need to manually return
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// // 4.
// // this is a nice title -> This Is a Nice Title
// const converTitleCase = function (title) {
//   const capitalise = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalise(word)))
//     .join(' ');
//   return capitalise(titleCase);
// };
// console.log(converTitleCase('this is a nice title'));
// console.log(converTitleCase('this is a LONG title but not too long you know'));
// console.log(converTitleCase('and here is another title with an EXAMPLE'));
