const {unlink,stat} = require("fs");
/*
FUNCTION: deleteFile
PURPOSE:  test if file exisi delete && if eCheck ture only delete if empty
PARAMS:   object
RETURN:  bool
*/
module.exports =  async filePath => {
  stat(filePath, async function(e, stats) {
    if (e) {
      return false;
    } else {
        unlink(filePath, function(err) {
          if (e) {
            console.log(e);
            return false;
          }
          console.log("file deleted successfully");
          return true;
        });
    }
  });
};
