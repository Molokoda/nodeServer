const fs = require('fs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

async function tryToConnect(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
}
tryToConnect();

class User extends Model {}
User.init({
  login: DataTypes.STRING,
  password: DataTypes.STRING,
  avatar: DataTypes.STRING
}, { sequelize, modelName: 'users' });
sequelize.sync();

async function addUserToDB(user){
    await bcrypt.hash(user.password, saltRounds, function(err, hash) {
        User.create({
            ...user,
            password: hash
        })
    });
    
}

async function getAllUsersFromDB(){
    const users = await User.findAll();
    return JSON.stringify(users, null, 2);
}

async function getUserFromDB(userId){
    const user = await User.findOne( {
        where:{
            id: Number(userId)
        }
    } );
    if (user === null) {
        return('Not Found');
    } else {
        return user
    }
}

async function rewriteUserFromDB(user, dataToUpdate){
    if(user){
        for(let key in dataToUpdate){
            user[key] = dataToUpdate[key];
        }
        await user.save();
        return user
    }
    else{
        return('Not found');
    }
}

async function deleteUserFromDB(id){
    const dbUser = await User.findOne( {
        where:{
            id: Number(id)
        }
    } );
    if(dbUser){
        await dbUser.destroy();
    }
    else{
        console.log('Not found');
    }
    
}

class DBusersService {

    getAllUsers = async() => {
        return getAllUsersFromDB()
    }    
         

    getUser = (id) => {
        return getUserFromDB(id);
    }

    getMe = (id) => {
        return getUserFromDB(id);
    }

    addUser = (user) => {
        addUserToDB(user);
    }

    update = (dataToUpdate, id) => {
        getUserFromDB(id)
            .then( user => {
                rewriteUserFromDB(user, dataToUpdate)
            })
            .then( result => {return result} );
    }

    deleteUser = (id) => {
        deleteUserFromDB(id);
    }

    login = (userData) => {
        return getUserFromDB(userData.id)
            .then(user => {
                return [bcrypt.compare( userData.password, user.password), user];
        })
            .then(result => {
                if(result[0]){
                    let id = userData.id;
                    const token = jwt.sign( { id }, 'secret');
                    const user = result[1];
                    return {token, user };
                }
                else{
                    return 'Invalid data';
                }
        })
    }
}

function writeToFile(data){
    data = JSON.stringify(data);
    fs.writeFile('./data/users.json', data, (err) => {
        if (err) throw err;
    });
}
class JSONusersService {

    userList = fs.readFile('./data/users.json',(err, data) => {
        if(err){
            throw err;
        }else{
            this.userList = data.toString();
            this.userList = JSON.parse(this.userList);
             
        }
    })  

    getAllUsers = () => {
        return this.userList;
    }

    getUser = (id) => {
        let user = this.userList.find(user => user.id === id);
        return user;
    }

    addUser = (user) => {
        if(user){
            user.id = uuid.v4();
            this.userList.push(user);
            writeToFile(this.userList);
        }
        return this.usersList;
    }

    rewriteUser = (id, user) => {
        if(user){
            this.userList.forEach(userFromList => {
                if(userFromList.id === id){
                    for(let key in user){
                        userFromList[key] = user[key];
                    }   
                } 
            });
            writeToFile(this.userList);
        }  
        return this.userList;
    }

    deleteUser = (id) => {
        let indexForDelete; 
        this.userList.map((user, index) => {
            if(user.id === id){
                indexForDelete = index;
            } 
        })
        if(indexForDelete || indexForDelete === 0){
            for(let i = indexForDelete; i < this.userList.length - 1; i++){
                this.userList[i] = this.userList[i + 1];
            }
            this.userList.pop();
            writeToFile(this.userList);
            return this.userList;
        }
        else{
            return(`There is no user with such id = ${id}`);
        }
            
    }
}


//module.exports = new JSONusersService();
module.exports = new DBusersService();

