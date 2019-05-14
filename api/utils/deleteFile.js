const { unlink, stat, createWriteStream } = require("fs"),
  moment = require("moment");
/*
FUNCTION: deleteFile
PURPOSE:  test if file exisi delete && if eCheck ture only delete if empty
PARAMS:   object
RETURN:  bool
*/
module.exports = (filePath, eCheck = false) => {
  stat(filePath, function(e, stats) {
    if (e) {
      return e;
    } else {
      console.log(stats); //here we got all information of file in stats variable
      if (eCheck) {
        const inBytes = stats.size;
        if (inBytes == 0) {
          unlink(filePath, function(err) {
            if (e) {
              return false;
            }
            console.log("file deleted successfully");
            return true;
          });
        } else {
          return false;
        }
      } else {
        unlink(filePath, function(err) {
          if (e) {
            return false;
          }
          console.log("file deleted successfully");
          return true;
        });
      }
    }
  });
};
