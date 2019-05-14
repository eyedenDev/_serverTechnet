const {
  unlink,
  stat,
  createWriteStream,
  readFileSync,
  readFile
} = require("fs");
/*
FUNCTION: deleteFile
PURPOSE:  test if file exisi delete && if eCheck ture only delete if empty
PARAMS:   object
RETURN:  bool
*/

module.exports = async (filePath, eCheck, treatmentTableId) => {
  stat(filePath, async function(e, stats) {
    if (e) {
      return false;
    } else {
      console.log(filePath);
      console.log(eCheck);
      console.log(treatmentTableId);
      if (eCheck) {
        const inBytes = stats.size;
        if (inBytes == 0) {
          console.log('its 000000');
          unlink(filePath, function(err) {
            if (e) {
              return false;
            }
            console.log("file deleted successfully1");
            return true;
          });
        } else {
          // save to db then delete
          try {
            let data = readFileSync(filePath, "utf8");
            console.log(data);
            try {
              let insert = await pool_a.query(
                "INSERT INTO captureErrors SET ?",
                { treatment_id: treatmentTableId, logData: data }
              );
              if ((insert.affectedRows >= 1)) {
                unlink(filePath, function(err) {
                  if (e) {
                    return false;
                  }
                  console.log("file deleted successfully2");
                  return true;
                });
              }
            } catch (e) {
              console.log("Error:", e.stack);
            }
            console.log(data);
          } catch (e) {
            console.log("Error:", e.stack);
          }
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
