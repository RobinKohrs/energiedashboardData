let test = {
  date1: [
    {
      time: 1,
      value: 5,
    },
    {
      time: 2,
      value: 6,
    },
  ],
  date2: [
    {
      time: 1,
      value: 20,
    },
    {
      time: 2,
      value: 10,
    },
  ],
};

let keys = Object.keys(test);
let red = keys.reduce((acc, curr) => {
  return (acc[curr] = test[curr].map((e) => e.value));
}, {});

console.log(`red: `, red);

let result = {
  date1: {
    values: [5, 6],
    times: [1, 2],
  },
  date2: {
    values: [1, 2],
    times: [10, 20],
  },
};
