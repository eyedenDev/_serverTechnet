//  FUNCTION::  processFiles
//  PURPOSE::   iterate throught returned results and return formatted json obj
//  RETURN::    JSON OBJECT
module.exports.processFiles = resultFiles => {
  let filteredData = {};

  if (resultFiles.length >= 1) {
    let key = 'files';
    filteredData[key] = [];
    resultFiles.forEach((file, index) => {
      var data = {
        fileName: resultFiles[index].name,
        mimetype: resultFiles[index].mimetype,
        link: resultFiles[index].link
      };
      filteredData[key].push(data);
    });

    return filteredData;
  }
};

//  FUNCTION::  processContacts
//  PURPOSE::   iterate throught returned results of customer contacts
//  RETURN::    formatted JSON OBJECT
module.exports.processContacts = (contactsArray, filteredData) => {
  console.log('{{{{{{{{{{{{{{{{{{{{{{{{{{++++++}}}}}}}}}}}}}}}}}}}}}}}}}}');
  console.log(contactsArray);
  if (contactsArray.length >= 1) {
    let key = 'contacts';
  }
};

//  FUNCTION::  processContactFilter
//  PURPOSE::   iterate throught returned contacts results and return formatted json obj
//  RETURN::    JSON OBJECT
module.exports.processContactFilter = responseData => {
  const filteredData = {},
    // contact_id = responseData.items[0].app_item_id,
    resultFields = responseData.items[0].fields;
  filteredData['contact_id'] = responseData.items[0].app_item_id;
  // console.log(resultFields);

  resultFields.forEach((field, index) => {
    console.log(field.external_id);
    switch (field.external_id) {
    case 'notes':
      filteredData['notes'] = stripTags(resultFields[index].values[0].value);
      break;
    case 'tech-mist-industry':
      filteredData['industry'] = {
        industry: resultFields[index].values[0].value.text,
        industryId: resultFields[index].values[0].value.id
      };
      break;
    case 'address-2':
      // filteredData['address'] = resultFields[index].values[0].value;
      filteredData['address'] = {
        address: resultFields[index].values[0].street_address,
        city: resultFields[index].values[0].city,
        state: resultFields[index].values[0].state,
        postal: resultFields[index].values[0].postal_code,
        country: resultFields[index].values[0].country
      };
      break;
    case 'email':
      filteredData['email'] = resultFields[index].values[0].value;
      break;
    case 'mobile-phone':
      filteredData['mobilePhone'] = resultFields[index].values[0].value;
      break;
    case 'phone':
      filteredData['phone'] = resultFields[index].values[0].value;
      break;
    case 'job-title':
      filteredData['jobTitle'] = resultFields[index].values[0].value;
      break;
    case 'company':
      filteredData['company'] = resultFields[index].values[0].value;
      break;
    case 'details':
      filteredData['name'] = resultFields[index].values[0].value;
      break;
    default:
      // details -- contact name
      filteredData['name'] = resultFields[index].values[0].value;
    }
  });
  return filteredData;
};
