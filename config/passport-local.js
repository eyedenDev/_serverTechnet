const LocalStrategy = require('passport-local').Strategy,
  CONFIG = require('./config'),
  bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      user = await pool_a.query('SELECT * FROM _users WHERE id = ? ', [id]);
      if(!user) {
        return done(new Error('user not found'));
      } else {
      const loggedUser = {
        id: user[0].id,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        email: user[0].email,
        account_type: user[0].account_type
      };
      done(null, loggedUser);
    }
    } catch (e) {
      done(e);
    }
  });

  passport.use(
    'local-login',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
       async function(req, email, password, done) {
         let user;
         try {
           user = await pool_a.query('SELECT * FROM _users WHERE `email` = ?',[email]);

           if(!user) {
             return done(null,false,req.flash('loginMessage', 'No user found.'));
           }
         } catch (e) {
           return done(e);
         }

       if (!bcrypt.compareSync(password, user[0].password)) {
         return done(null,false,req.flash('loginMessage', 'Oops! Wrong password.'));
       }

       const currentUser = {
           id: user[0].id,
           first_name: user[0].first_name,
           last_name: user[0].last_name,
           account_type: user[0].account_type,
           isAuthed: true
         },
         updateQuery = 'UPDATE `_users` SET ? WHERE id=?',
         statusUpDate = [{ loggedIn: 1 }, currentUser.id];
         try {
           let updatedLogin = await pool_a.query(updateQuery,statusUpDate);
         } catch (e) {
           return done(e);
         }
         return done(null, currentUser);
      }
    )
  );
};
