const fs = require("fs"),
  cp = require("child_process"),
  prog = "./api/utils/weatherCapture.js",
  child = cp.spawn(
    prog,
    ["TT49_0031_1083558489_weatherData.json", 49.086102, -122.402603],
    { detatched: true, stdio: "ignore" }
  );
child.unref();
