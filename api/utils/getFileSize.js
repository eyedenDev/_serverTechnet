const { stat, createWriteStream } = require("fs"),
  moment = require("moment");

// moment = require("moment");
/*
FUNCTION: getFileSize
PURPOSE:  get file size
PARAMS:   object
RETURN: int
*/
module.exports = (filePath, logstream) => {
  stat(filePath, function(e, stats) {
    console.log(stats.size, "<<<"); //here we got all information of file in stats variable
    const inBytes = stats.size;
    // inMB = inBytes / 1000000.0;
    // console.log(inBytes);
    // console.log(inMB);

    return inBytes;
  });
};
