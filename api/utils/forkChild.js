const data = process.argv.slice(2),
  minutes = 1,
  theInterval = minutes * 60;
console.dir(data, { colors: true });

let captureInterval = setInterval(async () => {
  console.dir(data, { colors: true });
}, theInterval);
