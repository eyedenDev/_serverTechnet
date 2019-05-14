const { statSync } = require("fs");
// moment = require("moment");
/*
FUNCTION: fileSize
PURPOSE:  get file size
PARAMS:   object
RETURN: int
*/
module.exports = filename => {
  const stats = statSync(filename),
    fileSizeInBytes = stats.size;
  return fileSizeInBytes;
};
