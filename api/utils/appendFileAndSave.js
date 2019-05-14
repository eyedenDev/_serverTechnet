const {
    readFileSync,
    readFile,
    writeFile,
    unlink,
    stat,
    createWriteStream
  } = require("fs"),
  getFileDetails = require("../utils/getFileDetails"),
  trim_N_Set_N_ReturnJSON = require("../utils/trim_N_Set_N_ReturnJSON"),
  moment = require("moment");
/*
FUNCTION: deleteFile
PURPOSE:  test if file exisi delete && if eCheck ture only delete if empty
PARAMS:   object
RETURN:  bool
*/
module.exports = processFile => {
  const {
      inusFolder,
      tableName,
      gateway_id,
      node_id,
      job_id,
      country_id,
      customer_id,
      location_id,
      itemNum,
      ofNum,
      tech_id,
      recordCount,
      logName,
      tableBaseName
    } = getFileDetails(processFile),
    startsWith = `{
    "into_tbl": "${tableBaseName}",
    "tech_id": ${tech_id},
    "doc_of": "${itemNum}",
    "of_docs": "${ofNum}",
    "records": "${recordCount}",
    "canary_data": [`,
    closing = `  ]
    }`,
    content = readFileSync(processFile, "utf8");

  // content = readFileSync(input, "utf8");
  // content = content.toUpperCase();
  let splitContent = content.split("\n");
  splitContent.splice(splitContent.indexOf("undefined\n"), 1);
  let result = splitContent.join("\n"),
    save_content = `${startsWith}${result}${closing}`;
  console.log(save_content);
  // writeFileSync(output, content);
};
