"use strict";
const { Readable } = require("stream"),
  utilities = require("../utils/utils");

class ProcessCanaryData extends Readable {
  constructor(array) {
    super({ objectMode: true }); //:: passing any type of javascript obj
    this.array = array;
    // this.calibrationns = calibrations
    this.index = 0; //first item to read
  }

  _read() {
    // read line of array
    if (this.index <= this.array.length) {
      // const node_data = this.array[this.index];
      // console.log(node_data.node_id);
      // //
      // // // calData ={
      // // //   node_id = node_data.node_id,
      // // // }
      // console.log(node_data);
      // // //
      // console.log("=-=-=-=-==-=--");
      // // // console.log(this.calibrations);

      const data = {
        data: this.array[this.index],
        index: this.index
      };
      this.push(data); // push data into stream
      this.index += 1;
    } else {
      // all data has been read
      this.push(null);
    }
  }
}

exports.ProcessCanaryData = ProcessCanaryData;
