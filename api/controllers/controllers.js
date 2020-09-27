//const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
var sqlite3 = require('sqlite3').verbose();
//var env = require('../envsAuth/.env.example')
var dotev = require("dotenv-safe").config();
var jwt = require('jsonwebtoken');

mongoose.set('useCreateIndex', true);

module.exports = app => {
    const controller = {};

    // CONECTANDO DATABASE MONGODB
    mongoose.connect('mongodb+srv://admin:DeaWwGL9Hbxf2tz@smarthome.op8ub.gcp.mongodb.net/sm_v1?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log("Conexão Feita " + con);
    }).catch((erro) =>{
        console.log("Conexão deu erro " + erro);
    });

    const Comodo = mongoose.model('smh_Comodo');
    const User = mongoose.model('smh_User');


    // CONECTANDO DATABASE SQLITE
    const DBSOURCE = "db.sqlite";
    const tableName_User = 'smh_Users';
    const tableName_Comodo = 'smh_Comodos';
    //const smhsqlite_UserCreateTableQuery = 'CREATE TABLE ' + tableName_User + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, IDMongodbUser TEXT, userID TEXT, username TEXT, nome TEXT, sobrenome TEXT, email TEXT, senha TEXT, celular TEXT, isActive NUMERIC, dispositivo TEXT, date NUMERIC)';
    //const smhsqlite_ComodoCreateTableQuery = 'CREATE TABLE ' + tableName_Comodo + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, IDMongodbComodo TEXT, IDU INTEGER, userID TEXT, username TEXT, comodoID TEXT, nomeComodo TEXT, tempComodo TEXT, umiComodoF TEXT, ajustTempComodo TEXT, statusLuzComodo NUMERIC, statusTomadaComodo NUMERIC, statusJanelaComodo NUMERIC, statusPortaComodo NUMERIC, statusPresencaComodo NUMERIC, statusArCondiconado NUMERIC, isActive NUMERIC, isFavorite NUMERIC, date NUMERIC, FOREIGN KEY(IDU) REFERENCES smh_User(id))';
    
    const smhsqlite_UserCreateTableQuery = 'CREATE TABLE ' + tableName_User + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, IDMongodbUser TEXT, username TEXT, nome TEXT, sobrenome TEXT, email TEXT, senha TEXT, celular TEXT, isActive NUMERIC, dispositivo TEXT, issync NUMERIC, date NUMERIC, UNIQUE(username))';
    const smhsqlite_ComodoCreateTableQuery = 'CREATE TABLE ' + tableName_Comodo + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, IDMongodbComodo TEXT, IDU INTEGER, IDMongodbUser TEXT, nomeComodo TEXT, tempComodo TEXT, umiComodoF TEXT, ajustTempComodo TEXT, statusLuzComodo NUMERIC, statusTomadaComodo NUMERIC, statusJanelaComodo NUMERIC, statusPortaComodo NUMERIC, statusPresencaComodo NUMERIC, statusArCondiconado NUMERIC, isActive NUMERIC, isFavorite NUMERIC, isPareado NUMERIC, dispPareado TEXT, issync NUMERIC, date NUMERIC, FOREIGN KEY(IDU) REFERENCES smh_Users(id))';

    let db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
        }else{
            console.log('CONECTADO A DATABASE  SQLITE.')
            db.run(smhsqlite_UserCreateTableQuery,(err) => {
                if (err) {
                    console.log("Tabela User ja esta criada");
                }else{
                    // Table just created, creating some rows
                    console.log("Tabela User Criada com sucesso");
                }
            });
            db.run(smhsqlite_ComodoCreateTableQuery,(err) => {
                if (err) {
                    console.log("Tabela Comodo ja esta criada");
                }else{
                    // Table just created, creating some rows
                    console.log("Tabela Comodo Criada com sucesso");
                }
            });  
        }
    });

    
    // COMODOS

    //__GET + MONGODB
    controller.listComodos = (req, res, next) => {
        Comodo.find({}).then((comodo) =>{
            console.log(comodo)
            res.status(200).json(comodo);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Comodo Encontrado: " + err
            });
        });
    };

    //__GET + SQLITE
    controller.listComodosSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo;
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":rows
                });
            }
        });
    };

    //__GET BY ID + MONGODB
    controller.getComodoByID = (req, res) => {
        Comodo.findOne({_id: req.params.ComodoID}).then((comodo) =>{
            console.log(comodo)
            res.status(200).json(comodo);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Comodo Encontrado: " + err
            });
        });
    };

    //__GET BY ID + SQLITE
    controller.getComodoByIDSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo + " where id = ?"
        var params = [req.params.ComodoID]
        db.get(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":row
                });
            }
        });
    };

    //__GET BY comodoID + MONGODB
    /*controller.getComodoByComodoID = (req, res) => {
        Comodo.findOne({comodoID: req.params.ComodoID}).then((comodo) =>{
            res.status(200).json(comodo);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Comodo Encontrado: " + err
            });
        });
    };*/
    
    //__GET BY comodoID + SQLITE
    /*controller.getComodoByComodoIDSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo + " where comodoID = ?"
        var params = [req.params.ComodoID]
        db.get(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":row
                });
            }
        });
    };*/

    //__GET BY userID + MONGODB
    controller.getComodoByUsrIDComodo = (req, res) => {
        Comodo.find({userID: req.params.UsrIDComodo}).then((comodo) =>{
            res.status(200).json(comodo);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Comodo Encontrado: " + err
            });
        });
    };

    //__GET BY userID + SQLITE
    controller.getComodoByUsrIDComodoSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo + " where IDMongodbUser = ?"
        var params = [req.params.UsrIDComodo]
        db.all(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":row
                });
            }
        });
    };

    //__GET BY username + MONGODB
    /*controller.getComodoByUsernameComodo = (req, res) => {
        Comodo.findOne({userName: req.params.UsernameComodo}).then((comodo) =>{
            res.status(200).json(comodo);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Comodo Encontrado: " + err
            });
        });
    };*/

    //__GET BY username + SQLITE
    /*controller.getComodoByUsernameComodoSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo + " where username = ?"
        var params = [req.params.UsernameComodo]
        db.get(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":row
                })
            }
        });
    };*/

    //__GET BY IDMongodbComodo + SQLITE
    controller.getComodoByIDMCSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo + " where IDMongodbComodo = ?"
        var params = [req.params.IDMC]
        db.get(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":row
                });
            }
        });
    };

    //__GET BY ISFAVORITE + MONGODB
    controller.getComodoByIsFav = (req, res) => {
        Comodo.find({isFavorite: req.params.isFav}).then((comodo) =>{
            res.status(200).json(comodo);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Comodo Encontrado: " + err
            });
        });
    };

    //__GET BY ISFAVORITE + SQLITE
    controller.getComodoByIsFavSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo + " where isFavorite = ?"
        var params = [req.params.isFav]
        db.all(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":row
                });
            }
        });
    };

    //__GET BY ISFAVORITE, USERID + MONGODB
    controller.getComodoByIsFavUserID = (req, res) => {
        console.log(req.body);
        Comodo.find({isFavorite: req.body.isFav, userID: req.body.userID}).then((comodo) =>{
            res.status(200).json(comodo);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Comodo Encontrado: " + err
            });
        });
    };

    //__GET BY ISFAVORITE, USERID + SQLITE
    controller.getComodoByIsFavUserIDSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo + " where isFavorite = ? AND IDMongodbUser = ?"
        var params = [req.body.isFav, req.body.userID]
        db.all(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                console.log(row);
                res.json({
                    "message":"success",
                    "data":row
                });
            }
        });
    };

    // __POST + MONGODB
    controller.saveComodo = (req, res) => {
        console.log(req.body.isActive);
        const com = {
            userID: req.body.userID || "",
            //userName: req.body.userName || "",
            //comodoID: uuidv4() || "",
            nomeComodo: req.body.nomeComodo || "",
            tempComodo: req.body.tempComodo || "",
            umiComodoF: req.body.umiComodoF || "",
            ajustTempComodo: req.body.ajustTempComodo || "",
            statusLuzComodo: req.body.statusLuzComodo || false,
            statusTomadaComodo: req.body.statusTomadaComodo || false,
            statusJanelaComodo: req.body.statusJanelaComodo || false,
            statusPortaComodo: req.body.statusPortaComodo || false,
            statusPresencaComodo: req.body.statusPresencaComodo || false,
            statusArCondiconado: req.body.statusArCondiconado || false,
            isActive: req.body.isActive || false,
            isFavorite: req.body.isFavorite || false,
            isPareado: req.body.isPareado || false,
            dispPareado: req.body.dispPareado || "",
            issync: req.body.issync || false,
            date: new Date()
        }

        console.log(com);
        const comodo = Comodo.create(com, (err, c) =>{
            //console.log(c);
            messages = [];
            errors = [];
            var status = null;
            if(err){
                //console.log(String(err).replace(/\\*([\" ])/g, ' ') + " " + String(err.message).replace(/\\*([\" ])/g, ' '));
                errors.push(JSON.parse('{"error": true, "message": "Comodo Não Cadastrado: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
                res.status(400).json({
                    //error: true,
                    message: messages,
                    errors: errors
                });
            }
            else{
                // res.status(200).json({
                //     error: false,
                //     message: "Comodo Cadastrado Com Sucesso"
                // });
                messages.push(JSON.parse('{"error": false, "message": "Comodo Cadastrado Com Sucesso", "err": ""}'))
                if(c.issync){
                    console.log("INICIANDO SINCRONIZAÇÃO COM BASE LOCAL");
                    console.log(c);
                    var sql1 = "select * from " + tableName_User + " where  IDMongodbUser = ?"
                    var params = [c.userID]
                    db.get(sql1, params, (err, row) => {
                        if(row){
                            console.log("usuario encontrado");
                            if (err) {
                                console.log("err sqlite: "+err);
                                //res.status(400).json({"error": err, "message": err.message})
                                errors.push(JSON.parse('{"error": true, "message": "' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, ' ') + '"}'))
                                res.status(400).json({message: messages, errors: errors})
                                //return null;
                            }
                            else{
                                console.log(row)
                                //return row;
                                console.log(c._id)
                                var p = [c._id]
                                db.get("SELECT count(*) as t FROM " + tableName_Comodo + " WHERE IDMongodbComodo=?",p, (err,test) =>{
                                    if(err){
                                        console.log("deu erro: "+err);
                                        //res.status(400).json({"error": err, "message": err.message})
                                        errors.push(JSON.parse('{"error": true, "message": "' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, ' ') + '"}'))
                                        res.status(400).json({message: messages, errors: errors})
                                    }
                                    else{
                                        console.log(test.t);
                                        var count = test.t;
                                        if(count > 0){
                                            console.log("Coluna ja Existe na base do servidor, Sincronizado com sucesso")
                                            //res.json({"message": "Coluna ja Existe, Sincronizado com sucesso"})
                                            messages.push(JSON.parse('{"error": false, "message": "Coluna ja Existe na base do servidor, Sincronizado com sucesso", "err": ""}'))
                                            res.status(200).json({message: messages, errors: errors})
                                        }
                                        else{
                                            var sql ="INSERT INTO " + tableName_Comodo + " (IDMongodbComodo, IDU, IDMongodbUser, nomeComodo, tempComodo, umiComodoF, ajustTempComodo, statusLuzComodo, statusTomadaComodo, statusJanelaComodo, statusPortaComodo, statusPresencaComodo, statusArCondiconado, isActive, isFavorite, isPareado, dispPareado, issync, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                                            var params =[c._id, row.id, c.userID, c.nomeComodo, c.tempComodo, c.umiComodoF, c.ajustTempComodo, c.statusLuzComodo, c.statusTomadaComodo, c.statusJanelaComodo, c.statusPortaComodo, c.statusPresencaComodo, c.statusArCondiconado, c.isActive, c.isFavorite, c.isPareado, c.dispPareado, c.issync, c.date]
                                            db.run(sql, params, function (err, result) {
                                                if (err){
                                                    console.log(err)
                                                    //res.status(400).json({"error": err, "message": err.message})
                                                    errors.push(JSON.parse('{"error": true, "message": "' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, ' ') + '"}'))
                                                    res.status(400).json({message: messages, errors: errors})
                                                }
                                                else{
                                                    console.log("sincronizado com sucesso")
                                                    messages.push(JSON.parse('{"error": false, "message": "Sincronizado com Sucesso", "err": ""}'))
                                                    res.status(200).json({message: messages, errors: errors})
                                                }
                                                // res.json({
                                                //     "message": "success",
                                                //     "result": result,
                                                //     "id" : this.lastID
                                                // });
                                                //console.log(messages);
                                                //console.log(errors);
                                            });
                                        }
                                    }
                                    
                                });
                            }
                        }
                        else{
                            console.log("Usuario n encontrado");
                            //res.status(400).json({"message": "Usuario não encontrado na tabela de sincronização"})
                            errors.push(JSON.parse('{"error": true, "message": "Usuario não encontrado na tabela de sincronização", "err": "Comodo não Sincronizado"}'))
                            res.status(400).json({"message": messages, "errors": errors})
                            console.log(errors);
                            console.log(messages);
                        }
                    });
                }
                else{
                    res.status(200).json({"message": messages, "errors": errors})
                    console.log(errors);
                    console.log(messages);
                }
            }
            // console.log(messages);
            // console.log(errors);
        });
    };

    // __POST + SQLITE
    controller.saveComodoSQLite = async (req, res) => {
        //console.log(req.body.userID);
        var messages = [];
        var errors = [];
        const IDMgC = await Comodo.findOne({_id: req.body.IDMongodbComodo}).then((comodo) =>{
                console.log(comodo);
                //return comodo;
                return {
                    comd: comodo,
                    error: false,
                    message: 'Comodo encontrado na base de dados principal'
                }
            }).catch((err) =>{
                console.log("Erro: "+err)
                return {
                    comd: '',
                    error: true,
                    message: "Erro Banco de dados: " + err + " " + err.message
                }
            });

        if(IDMgC.error == true){
            errors.push(IDMgC);
        }
        else{
            t = {
                error: IDMgC.error,
                message: IDMgC.message
            }
            messages.push(t);
        }

        var idUserMg = null;
        var idComMg = null;
        
        if((req.body.IDMongodbUser == null || req.body.IDMongodbUser == '' || req.body.IDMongodbUser == undefined) && IDMgC.error === false && IDMgC.comd){
            idUserMg = IDMgC.comd.userID;
            idComMg = IDMgC.comd._id;
        }
        else{
            idUserMg = req.body.IDMongodbUser;
            idComMg = req.body.IDMongodbComodo;
        }

        console.log(idUserMg);
        
        console.log(IDMgC);

        // const teste = await getBySQLiteText(tableName_User, 'IDMongodbComodo', req, db);
        var sql1 = "select * from " + tableName_User + " where  IDMongodbUser = ?"
        var params = [idUserMg]
        db.get(sql1, params, (err, row) => {
            if(row){
                console.log("usuario encontrado");
                if (err) {

                    console.log("err sqlite: "+err);
                    errors.push(JSON.parse('{"error": true, "message": "Comodo Não Sincronizado: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
                    res.status(400).json({
                        //error: true,
                        message: messages,
                        errors: errors
                    });
                    //res.status(400).json({"error": err, "message": err.message})
                    //return null;
                }
                else{
                    console.log(row)
                    //return row;
                    var p = [idComMg]
                    db.get("SELECT count(*) as t FROM " + tableName_Comodo + " WHERE IDMongodbComodo=?",p, (err,test) =>{
                        if(err){
                            console.log("deu erro: "+err);
                            errors.push(JSON.parse('{"error": true, "message": "' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, ' ') + '"}'))
                            res.status(400).json({message: messages, errors: errors})
                            //res.status(400).json({"error": err, "message": err.message})
                        }
                        else{
                            console.log(test.t);
                            var count = test.t;
                            if(count > 0){
                                console.log("Sincronizado com sucesso")
                                messages.push(JSON.parse('{"error": false, "message": "Coluna ja Existe na base do servidor, Sincronizado com sucesso", "err": ""}'))
                                res.status(200).json({message: messages, errors: errors})
                                //res.json({"message": "Coluna ja Existe, Sincronizado com sucesso"})
                            }
                            else{
                                insert(row);
                            }
                        }
                        
                    });
                    //insert(row);
                }
            }
            else{
                console.log("Usuario n encontrado");
                errors.push(JSON.parse('{"error": true, "message": "Usuario não encontrado na tabela de sincronização", "err": "Comodo não Sincronizado"}'))
                res.status(400).json({
                    //error: true,
                    message: messages,
                    errors: errors
                });
                //res.status(400).json({"message": "Usuario não encontrado na tabela de sincronização"})
            }
        });
        function insert(row){
            console.log(row)
            const com = {
                IDMongodbComodo: req.body.IDMongodbComodo || IDMgC.comd._id,
                IDU: req.body.IDU || row.id,
                IDMongodbUser: req.body.IDMongodbUser || IDMgC.comd.userID || "",
                //userName: req.body.userName || IDMgC.userName || "",
                //comodoID: req.body.comodoID || IDMgC.comodoID || "",
                nomeComodo: req.body.nomeComodo || IDMgC.comd.nomeComodo || "",
                tempComodo: req.body.tempComodo || IDMgC.comd.tempComodo || "",
                umiComodoF: req.body.umiComodoF || IDMgC.comd.umiComodoF || "",
                ajustTempComodo: req.body.ajustTempComodo || IDMgC.comd.ajustTempComodo || "",
                statusLuzComodo: req.body.statusLuzComodo || IDMgC.comd.statusLuzComodo || false,
                statusTomadaComodo: req.body.statusTomadaComodo || IDMgC.comd.statusTomadaComodo || false,
                statusJanelaComodo: req.body.statusJanelaComodo || IDMgC.comd.statusJanelaComodo || false,
                statusPortaComodo: req.body.statusPortaComodo || IDMgC.comd.statusPortaComodo || false,
                statusPresencaComodo: req.body.statusPresencaComodo || IDMgC.comd.statusPresencaComodo || false,
                statusArCondiconado: req.body.statusArCondiconado || IDMgC.comd.statusArCondiconado || false,
                isActive: req.body.isActive || IDMgC.comd.isActive || false,
                isFavorite: req.body.isFavorite || IDMgC.comd.isFavorite || false,
                isPareado: req.body.isPareado || IDMgC.comd.isPareado || false,
                dispPareado: req.body.dispPareado || IDMgC.comd.dispPareado || "",
                issync: req.body.issync || IDMgC.comd.issync || false,
                date: req.body.date || IDMgC.comd.date || new Date()
            }
            //var sql ="INSERT INTO " + tableName_Comodo + " (IDMongodbComodo, IDU, userID, username, comodoID, nomeComodo, tempComodo, umiComodoF, ajustTempComodo, statusLuzComodo, statusTomadaComodo, statusJanelaComodo, statusPortaComodo, statusPresencaComodo, statusArCondiconado, isActive, isFavorite, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            //var sql ="INSERT INTO " + tableName_Comodo + " (IDMongodbComodo, IDU, IDMongodbUser, username, nomeComodo, tempComodo, umiComodoF, ajustTempComodo, statusLuzComodo, statusTomadaComodo, statusJanelaComodo, statusPortaComodo, statusPresencaComodo, statusArCondiconado, isActive, isFavorite, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            console.log(IDMgC.comd.issync);
            console.log(com.issync);
            if(com.issync){
                var sql ="INSERT INTO " + tableName_Comodo + " (IDMongodbComodo, IDU, IDMongodbUser, nomeComodo, tempComodo, umiComodoF, ajustTempComodo, statusLuzComodo, statusTomadaComodo, statusJanelaComodo, statusPortaComodo, statusPresencaComodo, statusArCondiconado, isActive, isFavorite, isPareado, dispPareado, issync, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var params =[com.IDMongodbComodo, com.IDU, com.IDMongodbUser, com.nomeComodo, com.tempComodo, com.umiComodoF, com.ajustTempComodo, com.statusLuzComodo, com.statusTomadaComodo, com.statusJanelaComodo, com.statusPortaComodo, com.statusPresencaComodo, com.statusArCondiconado, com.isActive, com.isFavorite, com.isPareado, com.dispPareado, com.issync, com.date]
                db.run(sql, params, function (err, result) {
                    if (err){
                        errors.push(JSON.parse('{"error": true, "message": "' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, ' ') + '"}'))
                        res.status(400).json({message: messages, errors: errors})
                        // res.status(400).json({"error": err, "message": err.message})
                    }
                    else{
                        messages.push(JSON.parse('{"error": false, "message": "Sincronizado com Sucesso", "err": ""}'))
                        res.status(200).json({message: messages, errors: errors})
                        // res.json({
                        //     "message": "success",
                        //     "data": com,
                        //     "result": result,
                        //     "id" : this.lastID
                        // })
                    }
                });
            }
            else{
                messages.push(JSON.parse('{"error": false, "message": "Sincronização não ativada, comodo não sincrinizado", "err": ""}'));
                res.status(200).json({message: messages, errors: errors});
            }
        }
        //console.log(teste);
    };

    // __DELETE BY ID + MONGODB
    controller.deleteBYIDComodo = (req, res) => {
        const comodo = Comodo.deleteOne({_id: req.params.deleteID}, (erro) =>{
            if(erro){
                res.status(400).json({
                    error: true,
                    message: "Comodo Não Foi Deletado Com Sucesso: " + err
                });
            }
            else{
                res.status(200).json({
                    error: false,
                    message: "Comodo Deletado Com Sucesso"
                });
            }
        });
    };

    // __DELETE BY ID + SQLITE
    controller.deleteBYIDComodoSQLite = (req, res) => {
        db.run(
            'DELETE FROM ' + tableName_Comodo + ' WHERE id = ?',
            req.params.deleteID,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                else{
                    res.json({"message":"deleted", changes: this.changes})
                }
        });
    };

    // __DELETE BY IDMongodbComodo + SQLITE
    controller.deleteBYIDMCSQLite = (req, res) => {
        db.run(
            'DELETE FROM ' + tableName_Comodo + ' WHERE IDMongodbComodo = ?',
            req.params.deleteID,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                    return;
                }
                else{
                    res.json({"message":"deleted", changes: this.changes})
                }
        });
    };

    // __PUT BY ID + MONGODB
    controller.updateBYIDComodo = (req, res) => {
        console.log(req.body);
        const comodo = Comodo.updateOne({_id: req.params.updateID}, req.body, (erro, t) => {
            console.log(t);
            if(erro){
                res.status(400).json({
                    error: true,
                    message: "Comodo Não Foi Editado Com Sucesso: " + erro
                });
            }
            else{
                res.status(200).json({
                    error: false,
                    message: "Comodo Editado Com Sucesso"
                });
            }
        });
    };

    // __PUT BY ID + SQLITE
    controller.updateBYIDComodoSQLite = (req, res) => {
        var data = {
                nomeComodo: req.body.nomeComodo,
                tempComodo: req.body.tempComodo,
                umiComodoF: req.body.umiComodoF,
                ajustTempComodo: req.body.ajustTempComodo,
                statusLuzComodo: req.body.statusLuzComodo,
                statusTomadaComodo: req.body.statusTomadaComodo,
                statusJanelaComodo: req.body.statusJanelaComodo,
                statusPortaComodo: req.body.statusPortaComodo,
                statusPresencaComodo: req.body.statusPresencaComodo,
                statusArCondiconado: req.body.statusArCondiconado,
                isActive: req.body.isActive,
                isFavorite: req.body.isFavorite,
                isPareado: req.body.isPareado,
                dispPareado: req.body.dispPareado,
                issync: req.body.issync,
                date: req.body.date
        }
        db.run(
            `UPDATE ` + tableName_Comodo + ` set 
            nomeComodo = COALESCE(?,nomeComodo), 
            tempComodo = COALESCE(?,tempComodo), 
            umiComodoF = COALESCE(?,umiComodoF), 
            ajustTempComodo = COALESCE(?,ajustTempComodo), 
            statusLuzComodo = COALESCE(?,statusLuzComodo), 
            statusTomadaComodo = COALESCE(?,statusTomadaComodo), 
            statusJanelaComodo = COALESCE(?,statusJanelaComodo), 
            statusPortaComodo = COALESCE(?,statusPortaComodo), 
            statusPresencaComodo = COALESCE(?,statusPresencaComodo), 
            statusArCondiconado = COALESCE(?,statusArCondiconado), 
            isActive = COALESCE(?,isActive), 
            isFavorite = COALESCE(?,isFavorite),
            isPareado = COALESCE(?,isPareado),
            dispPareado = COALESCE(?,dispPareado),
            issync = COALESCE(?,issync), 
            date = COALESCE(?,date)
            WHERE id = ?`,
            [data.nomeComodo, data.tempComodo, data.umiComodoF, data.ajustTempComodo, data.statusLuzComodo, data.statusTomadaComodo, data.statusJanelaComodo, data.statusPortaComodo, data.statusPresencaComodo, data.statusArCondiconado, data.isActive, data.isFavorite, com.isPareado, com.dispPareado, data.issync, data.date, req.params.updateID],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                }
                else{
                    res.json({
                        message: "success",
                        data: data,
                        changes: this.changes
                    });   
                }
        });
    }

    // __PUT BY IDMongodbComodo + SQLITE
    controller.updateBYIDMCSQLite = (req, res) => {
        var data = {
                nomeComodo: req.body.nomeComodo,
                tempComodo: req.body.tempComodo,
                umiComodoF: req.body.umiComodoF,
                ajustTempComodo: req.body.ajustTempComodo,
                statusLuzComodo: req.body.statusLuzComodo,
                statusTomadaComodo: req.body.statusTomadaComodo,
                statusJanelaComodo: req.body.statusJanelaComodo,
                statusPortaComodo: req.body.statusPortaComodo,
                statusPresencaComodo: req.body.statusPresencaComodo,
                statusArCondiconado: req.body.statusArCondiconado,
                isActive: req.body.isActive,
                isFavorite: req.body.isFavorite,
                isPareado: req.body.isPareado,
                dispPareado: req.body.dispPareado,
                issync: req.body.issync,
                date: req.body.date
        }
        db.run(
            `UPDATE ` + tableName_Comodo + ` set 
            nomeComodo = COALESCE(?,nomeComodo), 
            tempComodo = COALESCE(?,tempComodo), 
            umiComodoF = COALESCE(?,umiComodoF), 
            ajustTempComodo = COALESCE(?,ajustTempComodo), 
            statusLuzComodo = COALESCE(?,statusLuzComodo), 
            statusTomadaComodo = COALESCE(?,statusTomadaComodo), 
            statusJanelaComodo = COALESCE(?,statusJanelaComodo), 
            statusPortaComodo = COALESCE(?,statusPortaComodo), 
            statusPresencaComodo = COALESCE(?,statusPresencaComodo), 
            statusArCondiconado = COALESCE(?,statusArCondiconado), 
            isActive = COALESCE(?,isActive), 
            isFavorite = COALESCE(?,isFavorite),
            isPareado = COALESCE(?,isPareado),
            dispPareado = COALESCE(?,dispPareado),
            issync = COALESCE(?,issync), 
            date = COALESCE(?,date)
            WHERE IDMongodbComodo = ?`,
            [data.nomeComodo, data.tempComodo, data.umiComodoF, data.ajustTempComodo, data.statusLuzComodo, data.statusTomadaComodo, data.statusJanelaComodo, data.statusPortaComodo, data.statusPresencaComodo, data.statusArCondiconado, data.isActive, data.isFavorite, data.isPareado, data.dispPareado, data.issync, data.date, req.params.updateID],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                }
                else{
                    res.json({
                        message: "success",
                        data: data,
                        changes: this.changes
                    });   
                }
        });
    }


    // USER

    //__GET + MONGODB
    controller.listUsers = (req, res) => {
        User.find({}).then((user) =>{
            res.status(200).json(user);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Usuario Encontrado: " + err
            });
        });
    };

    //__GET + SQLITE
    controller.listUsersSQLite = (req, res) =>{
        var sql = "select * from " + tableName_User;
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":rows
                });
            }
        });
    };

    //__GET BY ID + MONGODB
    controller.getUserByID = (req, res) => {
        User.findOne({_id: req.params.userID}).then((user) =>{
            res.status(200).json(user);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Usuario Encontrado: " + err
            });
        });
    };

    //__GET BY ID + SQLITE
    controller.getUserByIDSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo + " where id = ?"
        var params = [req.params.ComodoID]
        db.get(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":row
                });
            }
        });
    };

   //__GET BY username + MONGODB
    controller.getUserByUsername = (req, res) => {
        User.findOne({username: req.params.Username}).then((usr) =>{
            res.status(200).json(usr);
        }).catch((err) =>{
            res.status(400).json({
                error: true,
                message: "Nenhum Usuario Encontrado: " + err
            });
        });
    };

    //__GET BY username + SQLITE
    controller.getUserByUsernameSQLite = (req, res) =>{
        var sql = "select * from " + tableName_User + " where username = ?"
        var params = [req.params.Username]
        db.get(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":row
                })
            }
        });
    };

    //__GET BY IDMongodbUser + SQLITE
    controller.getUserByIDMUSQLite = (req, res) =>{
        var sql = "select * from " + tableName_Comodo + " where IDMongodbUser = ?"
        var params = [req.params.IDMU]
        db.get(sql, params, (err, row) => {
            if (err) {
              res.status(400).json({"error":err.message});
            }
            else{
                res.json({
                    "message":"success",
                    "data":row
                });
            }
        });
    };

    // __POST + MONGODB
    controller.saveUser = (req, res) => {
        const usr = {
            //userID: uuidv4() || "",
            username: req.body.username || "",
            nome: req.body.nome || "",
            sobrenome: req.body.sobrenome || "",
            email: req.body.email || "",
            senha: req.body.senha || "",
            celular: req.body.celular || "",
            isActive: req.body.isActive || false,
            dispositivo: req.body.dispositivo || "",
            issync: req.body.issync || false,
            date: new Date()
        }
        const user = User.create(usr, (err, c) =>{
            errors = [];
            messages = [];
            console.log(c);
            if(err){
                errors.push(JSON.parse('{"error": true, "message": "Usuario Não Cadastrado: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
                res.status(400).json({
                    messages: messages,
                    errors: errors
                });
            }
            else{
                // res.status(200).json({
                //     error: false,
                //     message: "Usuario Cadastrado Com Sucesso"
                // });
                messages.push(JSON.parse('{"error": false, "message": "Usuario Cadastrado Com Sucesso", "err": ""}'))
                if(c.issync){
                    console.log("SINCRONIZANDO USUARIO");
                    var p = [c._id]
                    db.get("SELECT count(*) as t FROM " + tableName_User + " WHERE IDMongodbUser=?",p, (err,test) =>{
                        if(err){
                            console.log("deu erro: "+err);
                            //res.status(400).json({"error": err, "message": err.message})
                            errors.push(JSON.parse('{"error": true, "message": "Usuario Não Cadastrado: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
                            res.status(400).json({
                                messages: messages,
                                errors: errors
                            });
                        }
                        else{
                            console.log(test.t);
                            var count = test.t;
                            if(count > 0){
                                console.log("Coluna ja Existe na base do servidor, Sincronizado com sucesso")
                                //res.json({"message": "Coluna ja Existe, Sincronizado com sucesso"})
                                messages.push(JSON.parse('{"error": false, "message": "Coluna ja Existe na base do servidor, Sincronizado com sucesso", "err": ""}'))
                                res.status(200).json({
                                    messages: messages,
                                    errors: errors
                                });
                            }
                            else{
                                var sql ="INSERT INTO " + tableName_User + " (IDMongodbUser, username, nome, sobrenome, email, senha, celular, isActive, dispositivo, issync, date) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                                var params =[c._id, c.username, c.nome, c.sobrenome, c.email, c.senha, c.celular, c.isActive, c.dispositivo, c.issync, c.date]
                                db.run(sql, params, function (err, result) {
                                    if (err){
                                        console.log(err)
                                        //res.status(400).json({"error": err, "message": err.message})
                                        errors.push(JSON.parse('{"error": true, "message": "Usuario Não Sincronizado: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
                                        res.status(400).json({
                                            messages: messages,
                                            errors: errors
                                        });
                                    }
                                    else{
                                        console.log("sincronizado com sucesso")
                                        messages.push(JSON.parse('{"error": false, "message": "Sincronizado com Sucesso", "err": ""}'))
                                        res.status(200).json({
                                            messages: messages,
                                            errors: errors
                                        });
                                    }
                                    // res.json({
                                    //     "message": "success",
                                    //     "result": result,
                                    //     "id" : this.lastID
                                    // });
                                    //console.log(messages);
                                    //console.log(errors);
                                });
                            }
                        }
                        
                    });
                }
                else{
                    res.status(200).json({
                        messages: messages,
                        errors: errors
                    });
                }
            }
        });
    };

    // __POST + SQLITE
    controller.saveUserSQLite = async (req, res) => {
        //console.log(req.body.userID);
        var messages = [];
        var errors = [];
        const IDMU = await User.findOne({_id: req.body.IDMongodbUser}).then((usr) =>{
            console.log(usr);
            //return usr;
            return {
                us: usr,
                error: false,
                message: 'Usuario encontrado para sicronizar' 
            }
        }).catch((err) =>{
            console.log("Erro: "+err)
            return {
                us: '',
                error: true,
                message: "Erro Banco de dados: " + err + " " + err.message
            }
        });

        if(IDMU.error == true){
            errors.push(IDMU);
        }
        else{
            t = {
                error: IDMU.error,
                message: IDMU.message
            }
            messages.push(t);
        }

        var idUserMg = null;
        
        if((req.body.IDMongodbUser == null || req.body.IDMongodbUser == '' || req.body.IDMongodbUser == undefined) && IDMU.error == false && IDMU.us){
            idUserMg = IDMgC.comd.userID;
        }
        else{
            idUserMg = req.body.IDMongodbUser;
        }

        
        console.log(IDMU);

        var p = [idUserMg]
        db.get("SELECT count(*) as t FROM "+ tableName_User +" WHERE IDMongodbUser=?",p, (err,test) =>{
            if(err){
                console.log("deu erro: "+err);
                errors.push(JSON.parse('{"error": true, "message": "Usuario Não Sincronizado: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
                res.status(400).json({
                    messages: messages,
                    errors: errors
                });
                //res.status(400).json({"error": err, "message": err.message})
            }
            else{
                console.log(test.t);
                var count = test.t;
                if(count > 0){
                    console.log("Sincronizado com sucesso")
                    messages.push(JSON.parse('{"error": false, "message": "Coluna ja Existe na base do servidor, Sincronizado com sucesso", "err": ""}'))
                    res.status(200).json({
                        messages: messages,
                        errors: errors
                    });
                    //res.json({"message": "Coluna ja Existe, Sincronizado com sucesso"})
                }
                else{
                    insert();
                }
            }
                        
        });
        function insert(){
            //console.log(row)
            const com = {
                IDMongodbUser: req.body.IDMongodbUser || IDMU.us._id || "",
                username: req.body.username || IDMU.us.username || "", 
                nome: req.body.nome || IDMU.us.nome || "", 
                sobrenome: req.body.sobrenome || IDMU.us.sobrenome || "", 
                email: req.body.email || IDMU.us.email || "", 
                senha: req.body.senha || IDMU.us.senha || "", 
                celular: req.body.celular || IDMU.us.celular || "", 
                isActive: req.body.isActive || IDMU.us.isActive || false, 
                dispositivo: req.body.dispositivo || IDMU.us.dispositivo || "",
                issync: req.body.issync || IDMU.us.issync || false,
                date: req.body.date || IDMU.us.date || ""
            }
            //var sql ="INSERT INTO " + tableName_Comodo + " (IDMongodbComodo, IDU, userID, username, comodoID, nomeComodo, tempComodo, umiComodoF, ajustTempComodo, statusLuzComodo, statusTomadaComodo, statusJanelaComodo, statusPortaComodo, statusPresencaComodo, statusArCondiconado, isActive, isFavorite, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            //var sql ="INSERT INTO " + tableName_Comodo + " (IDMongodbComodo, IDU, IDMongodbUser, username, nomeComodo, tempComodo, umiComodoF, ajustTempComodo, statusLuzComodo, statusTomadaComodo, statusJanelaComodo, statusPortaComodo, statusPresencaComodo, statusArCondiconado, isActive, isFavorite, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            if(com.issync){
                var sql ="INSERT INTO " + tableName_User + " (IDMongodbUser, username, nome, sobrenome, email, senha, celular, isActive, dispositivo, issync, date) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                var params =[com.IDMongodbUser, com.username, com.nome, com.sobrenome, com.email, com.senha, com.celular, com.isActive, com.dispositivo, com.issync, com.date]
                db.run(sql, params, function (err, result) {
                    if (err){
                        console.log("erro insert: " + err)
                        errors.push(JSON.parse('{"error": true, "message": "Usuario Não Cadastrado: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
                        res.status(400).json({
                            messages: messages,
                            errors: errors
                        });
                        //res.status(400).json({"error": err, "message": err.message})
                    }
                    else{
                        messages.push(JSON.parse('{"error": false, "message": "Sincronizado com Sucesso", "err": ""}'))
                        res.status(200).json({
                            messages: messages,
                            errors: errors
                        });
                        // res.json({
                        //     "message": "success",
                        //     "data": com,
                        //     "result": result,
                        //     "id" : this.lastID
                        // })
                    }
                });
            }
            else{
                messages.push(JSON.parse('{"error": false, "message": "Sincronização não ativada, usuario não sincrinizado", "err": ""}'));
                res.status(200).json({message: messages, errors: errors});
            }
        }
        //console.log(teste);
    };

    // __DELETE BY ID + MONGODB
    controller.deleteBYIDUser = (req, res) => {
        const user = User.deleteOne({_id: req.params.deleteID}, (erro) =>{
            if(erro){
                res.status(400).json({
                    error: true,
                    message: "Usuario Não Foi Deletado Com Sucesso: " + err
                });
            }
            else{
                res.status(200).json({
                    error: false,
                    message: "Usuario Deletado Com Sucesso"
                });
            }
        });
    };

    // __DELETE BY ID + SQLITE
    controller.deleteBYIDUserSQLite = (req, res) => {
        db.run(
            'DELETE FROM ' + tableName_User + ' WHERE id = ?',
            req.params.deleteID,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                }
                else{
                    res.json({"message":"deleted", changes: this.changes})
                }
        });
    };

    // __DELETE IDMongodbUser + SQLITE
    controller.deleteBYIDMUSQLite = (req, res) => {
        db.run(
            'DELETE FROM ' + tableName_User + ' WHERE IDMongodbUser = ?',
            req.params.deleteID,
            function (err, result) {
                if (err){
                    res.status(400).json({"error": res.message})
                }
                else{
                    res.json({"message":"deleted", changes: this.changes})
                }
        });
    };

    // __PUT BY ID + MONGODB
    controller.updateBYIDUser = (req, res) => {
        const user = User.updateOne({_id: req.params.updateID}, req.body, (erro) => {
            if(erro){
                res.status(400).json({
                    error: true,
                    message: "Usuario Não Foi Editado Com Sucesso: " + erro
                });
            }
            else{
                res.status(200).json({
                    error: false,
                    message: "Usuario Editado Com Sucesso"
                });
            }
        });
    };

    // __PUT BY ID + SQLITE
    controller.updateBYIDUserSQLite = (req, res) => {
        var data = {
                username: req.body.username, 
                nome: req.body.nome, 
                sobrenome: req.body.sobrenome, 
                email: req.body.email, 
                senha: req.body.senha, 
                celular: req.body.celular, 
                isActive: req.body.isActive, 
                dispositivo: req.body.dispositivo,
                issync: req.body.issync,
                date: req.body.date
        }
        db.run(
            `UPDATE ` + tableName_User + ` set  
            username = COALESCE(?,username), 
            nome = COALESCE(?,nome), 
            sobrenome = COALESCE(?,sobrenome), 
            email = COALESCE(?,email), 
            senha = COALESCE(?,senha), 
            celular = COALESCE(?,celular), 
            isActive = COALESCE(?,isActive), 
            dispositivo = COALESCE(?,dispositivo), 
            issync = COALESCE(?,issync), 
            date = COALESCE(?,date) 
            WHERE id = ?`,
            [data.username, data.nome, data.sobrenome, data.email, data.senha, data.celular, data.isActive, data.dispositivo, data.issync, data.date, req.params.updateID],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                }
                else{
                    res.json({
                        message: "success",
                        data: data,
                        changes: this.changes
                    });   
                }
        });
    }

    // __PUT BY IDMongodbUser + SQLITE
    controller.updateBYIDMUSQLite = (req, res) => {
        var data = {
                username: req.body.username, 
                nome: req.body.nome, 
                sobrenome: req.body.sobrenome, 
                email: req.body.email, 
                senha: req.body.senha, 
                celular: req.body.celular, 
                isActive: req.body.isActive, 
                dispositivo: req.body.dispositivo,
                issync: req.body.issync,
                date: req.body.date
        }
        db.run(
            `UPDATE ` + tableName_User + ` set  
            username = COALESCE(?,username), 
            nome = COALESCE(?,nome), 
            sobrenome = COALESCE(?,sobrenome), 
            email = COALESCE(?,email), 
            senha = COALESCE(?,senha), 
            celular = COALESCE(?,celular), 
            isActive = COALESCE(?,isActive), 
            dispositivo = COALESCE(?,dispositivo), 
            issync = COALESCE(?,issync), 
            date = COALESCE(?,date) 
            WHERE IDMongodbUser = ?`,
            [data.username, data.nome, data.sobrenome, data.email, data.senha, data.celular, data.isActive, data.dispositivo, data.issync, data.date, req.params.updateID],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                }
                else{
                    res.json({
                        message: "success",
                        data: data,
                        changes: this.changes
                    });   
                }
        });
    }

    // INTRO
    controller.intro = (req, res) => res.status(200).json({
        titulo: "Api Para SmartHome",
        message: "Pagina de Introdução"
    });


    // LOGIN
    controller.login = async (req, res, next) => {

        console.log(req.body);
        //console.log(req.body.senha)

        var user = await User.findOne({username: req.body.username}).then((usr) =>{
            return {
                us: usr,
                error: !usr ? true : false,
                errorMessage: '' 
            }
        }).catch((err) =>{
            console.log("Erro: "+err)
            return {
                us: '',
                error: true,
                errorMessage: "Erro Banco de dados: " + err + " " + err.message
            }
        });

        console.log(user);
        // console.log("username req: " + req.body.username);
        // console.log("username mongo: " + user.us.username);
        // console.log("senha req: " + req.body.senha);
        // console.log("senha mongo: " + user.us.senha);
        if(user.us != null && user.error === false){
            
            if(req.body.username == user.us.username && req.body.senha == user.us.senha ){
                //auth ok
                const id = user.us._id; //esse id viria do banco de dados
                var token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: "366d" // expires in 21 horas
                });
                res.json({ auth: true, token: token, expiresTime: "366 dias", idUser: user.us._id });
            }
            else{
                res.status(400).json({ auth: false, message: 'Login inválido!' });
            }

        }
        else{
            res.status(400).json({ auth: false, message: 'Usuario não encontrado, Login inválido!: ', usr: user });
        }
    }


    // LOGOUT
    controller.logout = (req, res, next) => {
        res.json({ auth: false, token: null });
    }


    // ALTER PASSWD MONGO
    controller.alterPassWd = async (req, res, next) => {

        var errors = [];
        var messages = [];

        var user = await User.findOne({username: req.body.username}).then((usr) =>{
            return {
                us: usr,
                error: false,
                message: 'User Encontrado' 
            }
        }).catch((err) =>{
            console.log("Erro: "+err)
            return {
                us: '',
                error: true,
                message: "Erro Banco de dados: " + err + " " + err.message
            }
        });

        console.log(user.error);
        console.log(user.us.username);

        if(user.error == true){
            errors.push(user)
        }
        else{
            t = {
                error: user.error,
                message: user.message
            }
            messages.push(t)
        }

        console.log(user);

        if(user.us != null && user.error == false){
            if(req.body.username == user.us.username && req.body.senha == user.us.senha){
                const usr = User.updateOne({_id: user.us._id}, {senha: req.body.newPasswd}, (err) => {
                    if(err){
                        errors.push(JSON.parse('{"error": true, "message": "Senha Não Editada: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
                        // res.status(400).json({
                        //     error: true,
                        //     message: "Usuario Não Foi Editado Com Sucesso: " + erro
                        // });
                        res.status(400).json({
                            errors: errors,
                            messages: messages
                        });
                    }
                    else{
                        // res.status(200).json({
                        //     error: false,
                        //     message: "Usuario Editado Com Sucesso"
                        // });
                        messages.push(JSON.parse('{"error": false, "message": "Senha Atualizada Com Sucesso", "err": ""}'))
                        if(user.us.issync){
                            db.run(
                                'UPDATE ' + tableName_User + ' set senha = ? WHERE IDMongodbUser = ?',
                                [req.body.newPasswd, user.us._id],
                                function (err, result) {
                                    if (err){
                                        errors.push(JSON.parse('{"error": true, "message": "Senha Não Editada na tabela de sincronização: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
                                        // res.status(400).json({"error": err.message})
                                        res.status(400).json({
                                            errors: errors,
                                            messages: messages
                                        });
                                    }
                                    messages.push(JSON.parse('{"error": false, "message": "Senha Atualizada Com Sucesso na tabela de sincronização", "err": ""}'))
                                    // res.json({
                                    //     message: "success",
                                    //     data: data,
                                    //     changes: this.changes
                                    // })
                                    res.status(200).json({
                                        errors: errors,
                                        message: messages
                                    });
                            });      
                        }
                        else{
                            res.status(200).json({
                                errors: errors,
                                message: messages
                            });
                        }
                    }
                });
            }
            else{
                errors.push(JSON.parse('{"error": true, "message": "Senha diferente da cadastrada", "err": "Não atualizado"}'))
                // res.status(400).json({"error": err.message})
                res.status(400).json({
                    errors: errors,
                    messages: messages
                });
            }
        }
        else{
            res.status(400).json({ error: true, message: 'Usuario não encontrado', usr: user });
        }

    }


    // // ALTER PASSWD SQLITE
    // controller.alterPassWdSQLite = async (req, res, next) => {
    //     console.log(req.body.username)
    //     var sql = "select * from " + tableName_User + " where username = ?"
    //     var params = [req.body.username]
    //     var user = await db.get(sql, params, (err, row) => {
    //         if (err) {
    //             e = {
    //                 us: '',
    //                 error: true,
    //                 errorMessage: "Erro Banco de dados: " + err + " " + err.message
    //             }

    //             res.status(400).json({ error: true, message: e });
    //         }
    //         else{
    //             u = {
    //                 us: row,
    //                 error: false,
    //                 errorMessage: '' 
    //             }

    //             if(req.body.username == u.us.username && req.body.senha == u.us.senha){
                    
    //                 db.run(
    //                     'UPDATE ' + tableName_User + ' set senha = ? WHERE IDMongodbUser = ?',
    //                     [req.body.newPasswd, u.us._id],
    //                     function (err, result) {
    //                         if (err){
    //                             errors.push(JSON.parse('{"error": true, "message": "Senha Não Editada na tabela de sincronização: ' + String(err.message).replace(/\\*([\" ])/g, ' ') + '", "err": "' + String(err).replace(/\\*([\" ])/g, '') + '"}'))
    //                             // res.status(400).json({"error": err.message})
    //                             res.status(400).json({
    //                                 errors: errors,
    //                                 messages: messages
    //                             });
    //                         }
    //                         messages.push(JSON.parse('{"error": false, "message": "Senha Atualizada Com Sucesso na tabela de sincronização", "err": ""}'))
    //                         // res.json({
    //                         //     message: "success",
    //                         //     data: data,
    //                         //     changes: this.changes
    //                         // })
    //                         res.status(200).json({
    //                             errors: errors,
    //                             message: messages
    //                         });
    //                 }); 

    //             }

    //             console.log(u)
    //         }
    //     });
    // }
  
    return controller;
}