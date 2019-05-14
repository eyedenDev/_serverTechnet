const { stat } = require("fs");

module.exports = testFile => {
  stat(testFile, function(err) {
    if (!err) {
      console.log("file or directory exists");
      return true;
    } else if (err.code === "ENOENT") {
      console.log("file or directory does not exist");
      return false;
    }
  });
};
