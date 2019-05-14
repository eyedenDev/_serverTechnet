/*
FUNCTION: getFileDetails
PURPOSE:  capture  treatmentDetails frfom table name and location
PARAMS:   filename :: String
RETURN:   Strings
*/
module.exports = filename => {
  const minusFolder = filename.substring(filename.indexOf("/") + 1),
    tableName = filename.substring(
      filename.indexOf("/") + 1,
      filename.indexOf("-")
    ),
    cleanFilename = filename.substring(filename.lastIndexOf("/") + 1),
    items = tableName.split("_"),
    gateway_id = items[0],
    node_id = items[1],
    job_id = items[2],
    country_id = items[3],
    customer_id = items[4],
    location_id = items[5],
    itemNum = filename.substring(
      filename.indexOf("-") + 1,
      filename.indexOf("]")
    ),
    ofNum = filename.substring(
      filename.indexOf("]") + 1,
      filename.indexOf("{")
    ),
    tech_id = filename.substring(
      filename.indexOf("{") - 1,
      filename.indexOf("}")
    ),
    recordCount = filename.substring(
      filename.lastIndexOf("-") + 1,
      filename.search(/.json/gm)
    ),
    capture_date = filename.substring(
      filename.indexOf("(") + 1,
      filename.indexOf(")")
    ),
    logName = `${tableName}-${itemNum}]${ofNum}{${tech_id}}_batchUploadErrs.log`,
    tableBaseName = `${gateway_id}_${node_id}_${job_id}_${country_id}_${customer_id}_${location_id}_`;
  console.log("filename:::: >>>>>> ", filename);
  return {
    minusFolder,
    cleanFilename,
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
    tableBaseName,
    capture_date
  };
};
