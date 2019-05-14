const { unlink, stat, createWriteStream } = require("fs"),
  moment = require("moment");
/*
FUNCTION: deleteFile
PURPOSE:  test if file exisi delete && if eCheck ture only delete if empty
PARAMS:   object
RETURN:  bool
*/
module.exports = (
  filePath,
  eCheck = false

  /*logstream,
  eCheck = false,
  logFolder = "batchErrs"*/
) => {
  /*
  let deleteFileLogger = createWriteStream(
    `./${logFolder}/${logstream}`,
    { flags: "a" } /*{ flags: 'a',
  encoding: null,
  mode: 0666  );}*/
  stat(filePath, function(e, stats) {
    if (e) {
      console.log(e);
      // deleteFileLogger.write(
      //   `Error occurred trying to getting file stat : ${moment(
      //     Date.now()
      //   ).format(
      //     "YYYY-MM-DD_hh:mm:ss",
      //     "America/Vancouver"
      //   )}\n  => stat error:${e}\n\n`
      // );
      return e;
    } else {
      console.log(stats); //here we got all information of file in stats variable
      if (eCheck) {
        const inBytes = stats.size;
        if (inBytes == 0) {
          unlink(filePath, function(err) {
            if (e) {
              console.log(e);
              // deleteFileLogger.write(
              //   `Error occurred trying to delete filedt: ${moment(
              //     Date.now()
              //   ).format(
              //     "YYYY-MM-DD_hh:mm:ss",
              //     "America/Vancouver"
              //   )}\n  => delete error:${e}\n\n`
              // );
              return false;
            }
            console.log("file deleted successfully");
            deleteFileLogger.end();
            return true;
          });
        } else {
          console.log("email tech...");
          return false;
        }
      } else {
        unlink(filePath, function(err) {
          if (e) {
            console.log(e);
            // deleteFileLogger.write(
            //   `Error occurred trying to delete filedt: ${moment(
            //     Date.now()
            //   ).format(
            //     "YYYY-MM-DD_hh:mm:ss",
            //     "America/Vancouver"
            //   )}\n  => delete error:${e}\n\n`
            // );
            return false;
          }
          console.log("file deleted successfully");
          deleteFileLogger.end();
          return true;
        });
      }
    }
  });
};
