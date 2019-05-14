const bcrypt = require("bcrypt-nodejs"),
  CONFIG = require("../config/config"),
  // pool_a = require('../config/asyncpool_a'),
  doesContain = require("../middleware/functions.js"),
  types = ["admin", "designer"],
  validateRegisterInput = require("../validation/register"),
  validatePasswordResetInput = require("../validation/passwordReset"),
  // mailer = require('../services/mailer'),
  ExpressData = require("../middleware/ExpressData"),
  showUsers = require("../middleware/showUsers"),
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

module.exports = (app, passport) => {
  var breadcrumbs = [
      { link: "/api", label: "Dashboard", isActive: false },
      { link: "#", label: "Users", isActive: true }
    ],
    captureQuery =
      "SELECT _users.* FROM _users WHERE NOT `id`=? ORDER BY last_name DESC",
    insertQuery = "INSERT INTO _users SET ?";
  // @route   GET atest  - [ testUsers ]
  // @desc    Tests user route
  // @access  Public
  app.get("/api/user/test", function(req, res) {
    res.status(200).json({
      message: "User routes are Works!",
      response: "success!"
    });
  });

  app.get("/api/user/logout", async (req, res) => {
    const updateQuery = "UPDATE `_users` SET ? WHERE id=?",
      statusUpDate = [{ loggedIn: 0 }, req.user.id];
    try {
      var updateResult = await pool_a.query(updateQuery, statusUpDate);
      if (updateResult) {
        req.logout();
        res.redirect("/");
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  });

  // @route   GET /api/use/profile  - [ getProfile ]
  // @desc    load  profile  &_users IF ADMIN|| DESIGN
  // @access  Public
  // app.get('/api/user_profile', async (req, res) => {
  app.get("/api/user/profile", async (req, res) => {
    let user = req.user,
      edit_user = {},
      selectQuery = "SELECT * FROM _users WHERE id=?",
      breadcrumbs = [
        { link: "/api", label: "Dashboard", isActive: false },
        { link: "/api/user", label: "Users", isActive: false },
        { link: "#", label: "Profile", isActive: true }
      ];

    try {
      var captured = await pool_a.query(selectQuery, user.id);
      if (captured) {
        edit_user = captured[0];
      }
    } catch (e) {
      return res.status(500).send(e);
    } finally {
      res.render("./users/user_profile", {
        title: "TechNet | User Profile",
        breadcrumbs,
        showUsers: showUsers(req.user.account_type),
        submit_label: "Update Profile",
        submit_value: "update",
        user: edit_user,
        message_type: "light",
        message: ""
      });
    }
  });

  // @route   GET /api/use/profile  - [ getProfile ]
  // @desc    load  profile  &_users IF ADMIN|| DESIGN
  // @access  Public
  app.post("/api/user/profile", upload.none(), async (req, res) => {
    let {
        id,
        first_name,
        last_name,
        email,
        account_type,
        old_password,
        new_password,
        conf_password
      } = req.body,
      accountType = account_type.length > 1 ? account_type[0] : account_type,
      isMatch = new_password == conf_password ? true : false,
      updateQuery = "UPDATE `_users` SET ? WHERE id=?",
      breadcrumbs = [
        { link: "/api", label: "Dashboard", isActive: false },
        { link: "/api/user", label: "Users", isActive: false },
        { link: "#", label: "Profile", isActive: true }
      ],
      update_state =
        old_password !== "" && !isMatch
          ? "not_matching"
          : old_password == "" && isMatch
          ? "empty"
          : "matching";

    switch (update_state) {
      case "not_matching":
        {
          let edit_user = {
              id,
              first_name,
              last_name,
              email,
              account_type,
              old_password,
              new_password,
              conf_password
            },
            message_type = "warning",
            message = "Passwords do not match";

          res.render("./users/user_profile", {
            title: "TechNet | User Profile",
            breadcrumbs,
            showUsers: showUsers(req.user.account_type),
            submit_label: "Update Profile",
            submit_value: "update",
            user: edit_user,
            message_type,
            message
          });
        }
        break;
      case "empty":
        {
          let profile_update = [
            { first_name, last_name, email, account_type: accountType },
            id
          ];
          try {
            var updateResult = await pool_a.query(updateQuery, profile_update);
            if (updateResult) {
              res.redirect("/api/display_treatments/all");
            }
          } catch (err) {
            return res.status(500).send(err);
          }
        }

        break;
      default: {
        let password = bcrypt.hashSync(new_password, null, null),
          profile_update = [
            {
              first_name,
              last_name,
              email,
              account_type: accountType,
              password
            },
            id
          ];
        try {
          var updateResult = await pool_a.query(updateQuery, profile_update);
          if (updateResult) {
            res.redirect("/api/display_treatments/all");
          }
        } catch (err) {
          return res.status(500).send(err);
        }
      }
    }
  });

  // @route   GET /api/profile  - [ getProfile ]
  // @desc    load  profile  &_users IF ADMIN|| DESIGN
  // @access  Public
  app.get("/api/user", async (req, res) => {
    let user = req.user,
      reqUsers = {},
      edit_user = {};
    try {
      var captured = await pool_a.query(captureQuery, user.id);
      if (captured) {
        reqUsers = captured;
      }
    } catch (e) {
      return res.status(500).send(e);
    } finally {
      res.render("./users/user_index", {
        title: "TechNet | Users",
        breadcrumbs,
        showUsers: showUsers(req.user.account_type),
        submit_label: "Create User",
        submit_value: "create",
        editUser: edit_user,
        users: reqUsers,
        add_or_edit: "USER",
        message_type: "light",
        message: ""
      });
    }
  });

  // @route   GET /api/user  - [ getProfile ]
  // @desc    load  update  & users IF ADMIN|| DESIGN
  // @access  Public
  app.get("/api/user/:id", async (req, res) => {
    var props = new ExpressData(req).props,
      action = props.action,
      user_id = props.id,
      user = req.user,
      reqUsers = {},
      edit_user = {},
      captureQuery =
        "SELECT * FROM _users WHERE NOT id=? ORDER BY last_name DESC",
      users_sql =
        action == "update"
          ? `SELECT * FROM _users WHERE id=?;${captureQuery}`
          : `DELETE FROM _users WHERE id=?;${captureQuery}`,
      user_info = [user_id, user.id];

    try {
      var editUsers = await pool_a.query(users_sql, user_info);
    } catch (e) {
      return res.status(500).send(e);
    } finally {
      edit_user = editUsers[0];
      reqUsers = editUsers[1];

      res.render("./users/user_index", {
        title: "TechNet | Users",
        breadcrumbs,
        showUsers: showUsers(req.user.account_type),
        form_label: "Update User",
        submit_label: "Update User",
        submit_value: "update",
        editUser: edit_user[0],
        users: reqUsers,
        add_or_edit: "USER",
        message_type: "light",
        message: ""
      });
    }
  });

  // @route   GET /api/user/:is  - [ getProfile ]
  // @desc    load  update  & users IF ADMIN|| DESIGN
  // @access  Private
  app.post("/api/user/:id", upload.none(), async (req, res) => {
    let props = new ExpressData(req).props,
      user_id = props.id,
      { first_name, last_name, email, account_type, processUser } = req.body,
      process_user = { first_name, last_name, email, account_type },
      updateUserQuery =
        "UPDATE _users SET first_name=?, last_name=?, email=?, account_type=?  WHERE id=?";

    let insertObjs = [first_name, last_name, email, account_type, user_id];
    try {
      var updateResult = await pool_a.query(updateUserQuery, insertObjs);
      if (updateResult) {
        res.redirect("/api/user");
      } else {
        var message_type = "danger",
          message = "An error occured please try again later";
        res.render("./users/user_index", {
          title: "TechNet | Users",
          breadcrumbs,
          showUsers: showUsers(req.user.account_type),
          submit_label: "Create User",
          submit_value: "create",
          editUser: process_user,
          users: updateResult[1],
          add_or_edit: "USER",
          message_type: message_type,
          message: message
        });
      }
    } catch (e) {
      return res.status(500).send(e);
    } finally {
      res.redirect("/api/canarys");
    }
  });

  // update user
  app.post("/api/user", upload.none(), async (req, res) => {
    let { first_name, last_name, email, account_type, processUser } = req.body,
      defaultPass = CONFIG.default_password,
      password = bcrypt.hashSync(defaultPass, null, null),
      process_user = { first_name, last_name, email, account_type },
      loggedIn = 0,
      newUser = {
        first_name,
        last_name,
        email,
        password,
        account_type,
        loggedIn
      },
      current_user = req.user,
      verifyQuery = `SELECT id FROM _users WHERE email=?;${captureQuery}`,
      verify_params = [email, current_user.id];

    try {
      var verifyResult = await pool_a.query(verifyQuery, verify_params);
      if (verifyResult[0].length > 0) {
        var message = "User already exists",
          message_type = "danger";
        res.render("./users/user_index", {
          title: "TechNet | Users",
          breadcrumbs,
          showUsers: showUsers(req.user.account_type),
          submit_label: "Create User",
          submit_value: "create",
          editUser: process_user,
          users: verifyResult[1],
          add_or_edit: "USER",
          message_type: message_type,
          message: message
        });
      } else {
        try {
          var insertResult = await pool_a.query(insertQuery, newUser);
          if (insertResult) res.redirect("/api/user");
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });
};
