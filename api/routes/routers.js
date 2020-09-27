var dotev = require("dotenv-safe").config();
var jwt = require('jsonwebtoken');

module.exports = app => {
    const controller = app.controllers.controllers;

    function verifyJWT(req, res, next){
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).json({ auth: false, message: 'Nenhum token providenciado' });
        
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            //console.log(err)
            //console.log(decoded)
          if (err) return res.status(401).json({ auth: false, message: 'Falha em autentificar o token' });
          
          // se tudo estiver ok, salva no request para uso posterior
          //req.userId = decoded.id;
          next();
        });
    }
  

    // COMODOS
    
    //__GET + MONGODB
    app.route('/api/getAllComodos').get(verifyJWT, controller.listComodos);

    //__GET + SQLITE
    app.route('/api/getAllComodosSQLite').get(verifyJWT, controller.listComodosSQLite);

    //__GET BY ID + MONGODB
    app.route('/api/getComodoByID/:ComodoID').get(verifyJWT, controller.getComodoByID);

    //__GET BY ID + SQLITE
    app.route('/api/getComodoByIDSQLite/:ComodoID').get(verifyJWT, controller.getComodoByIDSQLite);

    //__GET BY comodoID + MONGODB
    //app.route('/api/getComodoByComodoID/:ComodoID').get(controller.getComodoByComodoID);

    //__GET BY comodoID + SQLITE
    //app.route('/api/getComodoByComodoIDSQLite/:ComodoID').get(controller.getComodoByComodoIDSQLite);

    //__GET BY userID + MONGODB
    app.route('/api/getComodoByUsrIDComodo/:UsrIDComodo').get(verifyJWT, controller.getComodoByUsrIDComodo);

    //__GET BY userID + SQLITE
    app.route('/api/getComodoByUsrIDComodoSQLite/:UsrIDComodo').get(verifyJWT, controller.getComodoByUsrIDComodoSQLite);

    //__GET BY username + MONGODB
    //app.route('/api/getComodoByUsernameComodo/:UsernameComodo').get(controller.getComodoByUsernameComodo);

    //__GET BY username + SQLITE
    //app.route('/api/getComodoByUsernameComodoSQLite/:UsernameComodo').get(controller.getComodoByUsernameComodoSQLite);
    
    //__GET BY IDMongodbComodo + SQLITE
    app.route('/api/getComodoByIDMCSQLite/:IDMC').get(verifyJWT, controller.getComodoByIDMCSQLite);

    //__GET BY ISFAVORITE + MONGODB
    app.route('/api/getComodoByIsFav/:isFav').get(verifyJWT, controller.getComodoByIsFav);

    //__GET BY ISFAVORITE + SQLITE
    app.route('/api/getComodoByIsFavSQLite/:isFav').get(verifyJWT, controller.getComodoByIsFavSQLite);

    //__GET BY ISFAVORITE, USERID + MONGODB
    app.route('/api/getComodoByIsFavUserID').post(verifyJWT, controller.getComodoByIsFavUserID);

    //__GET BY ISFAVORITE, USERID + SQLITE
    app.route('/api/getComodoByIsFavUserIDSQLite').post(verifyJWT, controller.getComodoByIsFavUserIDSQLite);

    // __POST + MONGODB
    app.route('/api/createComodo').post(verifyJWT, controller.saveComodo);

    // __POST + SQLITE
    app.route('/api/createComodoSQLite').post(verifyJWT, controller.saveComodoSQLite);

    // __DELETE BY ID + MONGODB
    app.route('/api/deleteBYIDComodo/:deleteID').delete(verifyJWT, controller.deleteBYIDComodo);

    // __DELETE BY ID + SQLITE
    app.route('/api/deleteBYIDComodoSQLite/:deleteID').delete(verifyJWT, controller.deleteBYIDComodoSQLite);

    // __DELETE BY IDMongodbComodo + SQLITE
    app.route('/api/deleteBYIDMCSQLite/:deleteID').delete(verifyJWT, controller.deleteBYIDMCSQLite);

    // __PUT BY ID + MONGODB
    app.route('/api/updateBYIDComodo/:updateID').put(verifyJWT, controller.updateBYIDComodo);

    // __PUT BY ID + SQLITE
    app.route('/api/updateBYIDComodoSQLite/:updateID').put(verifyJWT, controller.updateBYIDComodoSQLite);

    // __PUT BY IDMongodbComodo + SQLITE
    app.route('/api/updateBYIDMCSQLite/:updateID').put(verifyJWT, controller.updateBYIDMCSQLite);
    

    // USER

    //__GET + MONGODB
    app.route('/api/getAllUsers').get(verifyJWT, controller.listUsers);

    //__GET + SQLITE
    app.route('/api/getAllUsersSQLite').get(verifyJWT, controller.listUsersSQLite);

    //__GET BY ID + MONGODB
    app.route('/api/getUserByID/:userID').get(verifyJWT, controller.getUserByID);

    //__GET BY ID + SQLITE
    app.route('/api/getUserByIDSQLite/:userID').get(verifyJWT, controller.getUserByIDSQLite);

    //__GET BY username + MONGODB
    app.route('/api/getUserByUsername/:Username').get(verifyJWT, controller.getUserByUsername);

    //__GET BY username + SQLITE
    app.route('/api/getUserByUsernameSQLite/:Username').get(verifyJWT, controller.getUserByUsernameSQLite);

    //__GET BY IDMongodbUser + SQLITE
    app.route('/api/getUserByIDMUSQLite/:IDMU').get(verifyJWT, controller.getUserByIDMUSQLite);

    // __POST + MONGODB
    app.route('/api/createUser').post(controller.saveUser);

    // __POST + SQLITE
    app.route('/api/createUserSQLite').post(controller.saveUserSQLite);

    // __DELETE BY ID + MONGODB
    app.route('/api/deleteBYIDUser/:deleteID').delete(verifyJWT, controller.deleteBYIDUser);

    // __DELETE BY ID + SQLITE
    app.route('/api/deleteBYIDUserSQLite/:deleteID').delete(verifyJWT, controller.deleteBYIDUserSQLite);

    // __DELETE IDMongodbUser + SQLITE
    app.route('/api/deleteBYIDMUSQLite/:deleteID').delete(verifyJWT, controller.deleteBYIDMUSQLite);

    // __PUT BY ID + MONGODB
    app.route('/api/updateBYIDUser/:updateID').put(verifyJWT, controller.updateBYIDUser);

    // __PUT BY ID + SQLITE
    app.route('/api/updateBYIDUserSQLite/:updateID').put(verifyJWT, controller.updateBYIDUserSQLite);

    // __PUT BY IDMongodbComodo + SQLITE
    app.route('/api/updateBYIDMUSQLite/:updateID').put(verifyJWT, controller.updateBYIDMUSQLite);


    // INTRO
    app.route('/').get(controller.intro);

    
    // LOGIN
    app.route('/api/login').post(controller.login);


    // LOGOUT
    app.route('/api/logout').post(controller.logout);


    // ALTER PASSWD MONGO
    app.route('/api/alterpasswd').post(verifyJWT, controller.alterPassWd);


    // ALTER PASSWD SQLITE
    // app.route('/api/alterPassWdSQLite').post(controller.alterPassWdSQLite);
}