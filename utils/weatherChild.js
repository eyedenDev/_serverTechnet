const cp = require("child_process"),
  path = require("path");
/*
FUNCTION: weatherChild
PURPOSE:  used to fork weathercapture file
PARAMS:   forkFile string, treatmentData array
RETURN:  bool
*/
module.exports = (forkFile, treatmentData) => {
  const weatherChild = cp.fork(forkFile, treatmentData, {
    cwd: "./api/utils/",
    silent: true,
    detached: true,
    stdio: "ignore"
  });
  weatherChild.unref();
};
