const utilities = require('../utils/utils');

// get item by app_item_id:
exports.getItemByAppId = function(podio, appId, appItemId) {
  var pdoQuery = `/app/${appId}/item/${appItemId}`;
  podio
    .isAuthenticated()
    .then(function() {
      podio.request('GET', pdoQuery).then(function(responseData) {
        res.status(200).send(responseData);
      });
    })
    .catch(function(err) {
      if (typeof authCode !== 'undefined') {
        podio.getAccessToken(authCode, redirectURL, function(err, response) {
          podio.request('GET', pdoQuery).then(function(responseData) {
            res.status(200).send(responseData);
          });
        });
      } else if (typeof errorCode !== 'undefined') {
        // a problem occured
        res.status(500).send({
          message: request.query.error_description,
          response: 'error!'
        });
      } else {
        // start authentication via link or redirect
        podio.authenticateWithApp(appId, appToken, err => {
          if (err) throw new Error(err);

          podio
            .isAuthenticated()
            .then(() => {
              podio.request('GET', pdoQuery, {}).then(function(responseData) {
                res.status(200).send(responseData);
              });
            })
            .catch(err => console.log(err));
        });
      }
    });
};

// exports.searchInItem = function(podio, appId, serchTerm, fields) {
//   var pdoQuery = `/app/${appId}/item/${appItemId}`;
//   podio
//     .isAuthenticated()
//     .then(function() {
//        podio.request('GET', pdoQuery).then(function(responseData) {
//          res.status(200).send(responseData);
//       });
//     })
//     .catch(function(err) {
//       if (typeof authCode !== 'undefined') {
//         podio.getAccessToken(authCode, redirectURL, function(err, response) {
//           podio.request('GET', pdoQuery).then(function(responseData) {
//             res.status(200).send(responseData);
//           });
//         });
//       } else if (typeof errorCode !== 'undefined') {
//         // a problem occured
//         res.status(500).send({
//           message: request.query.error_description,
//           response: 'error!'
//         });
//       } else {
//         // start authentication via link or redirect
//         podio.authenticateWithApp(appId, appToken, err => {
//           if (err) throw new Error(err);
//
//           podio
//             .isAuthenticated()
//             .then(() => {
//               podio
//                 .request('GET', pdoQuery, {})
//                 .then(function(responseData) {
//                   res.status(200).send(responseData);
//                 });
//             })
//             .catch(err => console.log(err));
//         });
//       }
//     });
// };

exports.searchInApp = function(podio, appId, serchTerm, fields) {
  const fields =
      fields !== undefined ? utilities.generalFuncs.pdoFilter(fields) : 'title',
    searchTerm = utilities.generalFuncs.pdoFilter(searchTerm),
    pdoQuery = `/search/app/${appId}/v2?counts=true&highlights=true&limit=20&offset=0&query=${searchTerm}&search_fields=${fields}`;
  podio
    .isAuthenticated()
    .then(function() {
      podio.request('GET', pdoQuery).then(function(responseData) {
        var result = responseData.results[0].item;

        return res.status(200).send(result);
      });
    })
    .catch(function(err) {
      if (typeof authCode !== 'undefined') {
        podio.getAccessToken(authCode, redirectURL, function(err, response) {
          return podio.request('GET', pdoQuery).then(function(responseData) {
            var result = responseData.results[0].item;

            res.status(200).send(result);
          });
        });
      } else if (typeof errorCode !== 'undefined') {
        // a problem occured
        res.status(500).send({
          message: request.query.error_description,
          response: 'error!'
        });
      } else {
        // start authentication via link or redirect
        podio.authenticateWithApp(appId, appToken, err => {
          if (err) throw new Error(err);

          podio
            .isAuthenticated()
            .then(() => {
              return podio
                .request('GET', pdoQuery, {})
                .then(function(responseData) {
                  var result = responseData.results[0].item;

                  res.status(200).send(result);
                });
            })
            .catch(err => console.log(err));
        });
      }
    });
};
