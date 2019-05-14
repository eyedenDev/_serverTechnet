const moment = require("moment"),
  showUsers = require("../middleware/showUsers"),
  showUsersSub = require("../middleware/showUsersSub"),
  multer = require("multer"),
  fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true); // save file
    } else {
      cb(null, false); // reject file  /* // throw err==> cb(, true); */
    }
  },
  storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + processFileName(file.originalname));
    }
  }),
  upload = multer({
    storage: storage,
    limit: {
      filesize: 1024 * 1024 * 5 // 5mb max
    },
    fileFilter: fileFilter
  });

module.exports = function(app, passport) {
  let crumbs = [
      { link: "/api", label: "Dashboard", isActive: true },
      { link: "#", label: "Gateways", isActive: true }
    ],
    getQuery = "SELECT * FROM gateways ORDER BY gateway ASC",
    loadEdit = `SELECT * FROM gateways WHERE gateway=?;${getQuery}`,
    updateQuery = "UPDATE gateways SET gateway=?, assignedTo=? WHERE gateway=?",
    deleteQuery = "DELETE FROM gateways WHERE `gateway`=?",
    node_type = "gateway",
    getResult,
    updateResult;

  // @route   GET api/CUB/test  - [ testgateways ]
  // @desc    Tests gateways route
  // @access  Public
  app.get("/api/gateways/test", function(req, res) {
    res.status(200).json({
      message: "Gatweways routes are Works!",
      response: "success!"
    });
  });

  // @route   GET api/CUB - [ getgatewaysPage ]
  // @desc    Load gatewayss dashboard page
  // @access  Public
  app.get("/api/gateways", async (req, res) => {
    let message_type = "light",
      message = "",
      submit_endpoint = "api/gateways",
      submit_label = "CREATE",
      add_or_edit = "GATEWAY",
      submit_value = "create",
      getResult;

    try {
      getResult = await pool_a.query(getQuery);
    } catch (e) {
      message_type = "danger";
      message = e;
    } finally {
      console.log(getResult);
      res.render("./gateways/gateway_index", {
        title: "TechNet | Gateways",
        breadcrumbs: crumbs,
        showUsers: showUsers(req.user.account_type),
        showUsersSub: showUsersSub(req.user.account_type),
        gateway_addEdit: {},
        moment,
        node_type,
        add_or_edit,
        submit_endpoint,
        submit_value,
        submit_label,
        gateways: getResult,
        message_type,
        message
      });
    }
  });

  // @route   GET api/CUB - [ getgatewaysPage ]
  // @desc    Load gatewayss dashboard page
  // @access  Public
  app.post("/api/gateways", upload.none(), async (req, res) => {
    let { gateway, processGate } = req.body;
    (message_type = "light"),
      (message = ""),
      (submit_endpoint = "api/gateways"),
      (submit_label = "CREATE"),
      (add_or_edit = "GATEWAY"),
      (submit_value = "create"),
      getResult,
      updateResult;
    switch (processGate) {
      case "edit":
        {
          submit_value = "update";
          submit_label = "UPDATE";
          try {
            var loadResult = await pool_a.query(loadEdit, [gateway]);
            console.log("+++++");
            console.log(loadResult[1]);
          } catch (e) {
            return res.status(500).send(e);
          } finally {
            res.render("./gateways/gateway_indexE", {
              title: "TechNet | Gateways",
              breadcrumbs: crumbs,
              showUsers: showUsers(req.user.account_type),
              showUsersSub: showUsersSub(req.user.account_type),
              gateway_addEdit: loadResult[0][0],
              node_type,
              submit_endpoint,
              submit_value,
              submit_label,
              gateways: loadResult[1],
              message_type,
              message
            });
          }
        }
        break;
      case "update":
        {
          let gateway = req.body.gateway,
            assignedTo = req.body.assignedTo,
            insertObjs = [gateway, assignedTo, gateway];
          try {
            updateResult = await pool_a.query(updateQuery, insertObjs);
          } catch (e) {
            return res.status(500).send(e);
          } finally {
            res.redirect("/api/gateways");
          }
        }
        break;
      case "delete":
        {
          try {
            var deleteResult = await pool_a.query(deleteQuery, gateway);
            if (deleteResult) res.redirect("/api/gateways");
          } catch (e) {
            return res.status(500).send(e);
          }
        }
        break;
      default: {
        let gateway = req.body.gateway,
          assignedTo = req.body.assignedTo,
          activationDate = moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
          newGateway = { gateway, assignedTo, activationDate },
          existsQuery = `SELECT * FROM gateways WHERE gateway=?;${getQuery}`,
          insertQuery = "INSERT INTO `gateways` SET ?",
          existsResult,
          submit_value = "create",
          submit_label = "CREATE";

        try {
          existsResult = await pool_a.query(existsQuery, [gateway]);
          console.log(existsQuery);
          console.log(gateway);
          console.log("=======");
          console.log(existsResult);

          if (existsResult[0].length > 0) {
            message = "NodGateway already exists";
            message_type = "warning";

            res.render("./gateways/gateway_index", {
              title: "TechNet | Gateways",
              breadcrumbs: crumbs,
              showUsers: showUsers(req.user.account_type),
              showUsersSub: showUsersSub(req.user.account_type),
              gateway_addEdit: newGateway,
              node_type,
              add_or_edit,
              submit_endpoint,
              submit_value,
              submit_label,
              gateways: getResult,
              message_type,
              message
            });
            try {
              getResult = await pool_a.query(getQuery);
            } catch (e) {
              return res.status(500).send(e);
            } finally {
              res.render("./gateways/gateway_index", {
                title: "TechNet | Gateways",
                breadcrumbs: crumbs,
                showUsers: showUsers(req.user.account_type),
                showUsersSub: showUsersSub(req.user.account_type),
                gateway_addEdit: newGateway,
                node_type,
                add_or_edit,
                submit_endpoint,
                submit_value,
                submit_label,
                gateways: getResult,
                message_type,
                message
              });
            }
          } else {
            try {
              var insertResult = await pool_a.query(insertQuery, newGateway);
              if (insertResult) res.redirect("/api/gateways");
            } catch (e) {
              return res.status(500).send(e);
            }
          }
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    }
  });
};
