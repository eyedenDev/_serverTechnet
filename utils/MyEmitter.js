const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on("event", table => {
  console.log(`an event occurred!!!! ${table}`);
});
myEmitter.emit("event");
