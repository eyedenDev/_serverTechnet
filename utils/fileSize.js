const { stat, createWriteStream } = require("fs"),
  moment = require("moment");

// moment = require("moment");
/*
FUNCTION: fileSize
PURPOSE:  get file size
PARAMS:   object
RETURN: int
*/
module.exports = (filePath, logstream) => {
  let fsLogger = createWriteStream(`./batchErrs/${logstream}_GGGGGG`, {
    flags: "a"
  });
  console.log(logstream);
  console.log("-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2");

  stat(filePath, function(e, stats) {
    if (e) {
      fsLogger.write(
        `Error occurred getting file size: ${moment(Date.now()).format(
          "YYYY-MM-DD_hh:mm:ss",
          "America/Vancouver"
        )}\n  => stat error:${e}\n\n`
      );
      // return console.error(e);
    }
    console.log(stats.size); //here we got all information of file in stats variable
    const inBytes = stats.size;
    // inMB = inBytes / 1000000.0;
    // console.log(inBytes);
    // console.log(inMB);
    fsLogger.end();
    return inBytes;
  });
};
