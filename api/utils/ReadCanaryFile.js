let fs = require("fs");
  data = '';
// mixin
// let treatmentFuncs = {
//   testFunc: str =>{
//     return str.toUpperCase();
//   },
//   calibrateData: data => {
//
//   }
// };

class ReadCanaryFile  {
  constructor(file) {
    //  invokes readable stream  && sets up stream obj
    //  () =>  passes binary data
    //  ({encoding: 'UTF-8'})=>  passes Strings
    // ({objectMode: true}); //:: passing any javascript obj
    super({objectMode: true}); //:: passing any type of javascript obj
    this.file = file;
  }

  _read() { // read line of array
    if (this.index <= this.array.length) {

    const data = {
      data: this.array[this.index],
      index: this.index
    };
    this.push(data); // push data into stream
    this.index += 1;
  } else { // all data has been read
    this.push(null);
  }

  }
}

// copy methods
// Object.assign(ReadCanaryFile.prototype, treatmentFuncs);
exports.ReadCanaryFile = ReadCanaryFile;
