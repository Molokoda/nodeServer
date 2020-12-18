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


class Photo extends Model{};
Photo.init({
    name: DataTypes.STRING,
    file_path: DataTypes.STRING,
    user_id: DataTypes.INTEGER
}, {sequelize, modelName: 'photos'});
sequelize.sync();
User.hasMany(Photo, {foreignKey: 'user_id'});

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
    return users;
}

async function getUserFromDB(userId){
    const user = await User.findOne( {
        where:{
            id: Number(userId)
        },
        include: [Photo]
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

    login = async(userData) => {
        const user = await getUserFromDB(userData.id);
        const result = await bcrypt.compare(userData.password, user.password);
        if(result){
            const id = userData.id;
            const token = jwt.sign( {id}, 'secret');
            return {token, user}
        }
        else{
            return 'Invalid data'
        }
    }
}

class DBphotoServices{
    createPhoto = async(user) =>{ 
        try{
            const photo = await Photo.create({...user});
            return photo
        }
        catch(err){
            return err.message
        }
        
    }

    readPhoto = async(photoId) => {
        const photo = await Photo.findOne( {
            where:{
                id: Number(photoId)
            }
        });

        if(photo){
            return photo
        }
        else{
            return ('Not found')
        }
    }

    readAllPhoto = async() => {
        const photos = await Photo.findAll();
        return photos;
    }

    updatePhoto = async(newData, photoId) =>{
        const photo = await Photo.findOne({
            where:{
                id: Number(photoId)
            }
        });

        if(photo){
            for(let key in newData){
                photo[key] = newData[key];
            }
            await photo.save();
            return photo
        }
        else{
            return('Not found')
        }
    }

    deletePhoto = async(photoId) => {
        const photo = await Photo.findOne({
            where:{
                id: Number(photoId)
            }
        });

        if(photo){
            await photo.destroy();
            return('Done');
        }
        else{
            return('Not Found')
        }
    }

    getSomePhotos = async(page, count) => {
        const amountOfPhotos = await Photo.count();
        if(amountOfPhotos >= page * count){
            const startId = page * count - count + 1;
            let answerArray = [];
            let photo;
            for(let currentId = startId; currentId < startId + Number(count); currentId++){
                photo = await Photo.findOne({where: {id: currentId }});
                answerArray.push(photo);
            }
            return answerArray;
        }
        else{
            return 'Too much'
        }
        
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
module.exports.DBusersService = new DBusersService();
module.exports.DBphotoServices =  new DBphotoServices();
