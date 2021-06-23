const express = require('express');
const Joi = require('joi');
const routes = express.Router();

const users = [
    {id: 1, name: 'Santiago Labatut'},
    {id: 2, name: 'Mariano Labatut'},
    {id: 3, name: 'Nicolas Marti'},
    {id: 4, name: 'Hernan Cañadas'}
];

//Consulta de todos los usuarios
routes.get('/', (req, res) => {
    res.send(users);
});

//Consulta de un usuario en especifico
routes.get('/:id', (req, res) => {
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    res.send(user);
});

//Crear un usuario
routes.post('/', (req, res) => {
    const {error, value} = userValidate(req.body.name)

    if(!error){
        const user = {
            id: users.length + 1,
            name: value.name
        };
        users.push(user);
        res.send(user);
    }else{
        res.status(400).send(error.message);
    }
});

//Modificar usuario
routes.put('/:id', (req, res) => {
    let user = userExist(req.params.id);

    if(!user){  
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 

    const {error, value} = userValidate(req.body.name)
    if(error){
        res.status(400).send(error.message);
        return;
    }

    user.name = value.name;
    res.send(user);
});

//Eliminar usuario
routes.delete('/:id', (req, res) => {
    let user = userExist(req.params.id);
    console.log(user);
    if(!user){  
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 

    const index = users.indexOf(user);
    users.splice(index, 1);
    res.send(users);
});

function userExist(userID){
    return users.find(user => user.id === parseInt(userID));
}

function userValidate(pName){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    return schema.validate({ name: pName });
}

module.exports = routes;