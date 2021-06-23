const express = require('express');
const config = require('config');
const morgan = require('morgan');
const logger = require('./logger');
const Joi = require('joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(logger);

//Configuracion de entornos
console.log('La aplicación: ' + config.get('nombre'));
//Uso de middleware
app.use(morgan('tiny'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Esuchando en el puerto', port, '...');
})

const users = [
    {id: 1, name: 'Santiago Labatut'},
    {id: 2, name: 'Mariano Labatut'},
    {id: 3, name: 'Nicolas Marti'},
    {id: 4, name: 'Hernan Cañadas'}
];

//Consulta de todos los usuarios
app.get('/api/users', (req, res) => {
    res.send(users);
});

//Consulta de un usuario en especifico
app.get('/api/users/:id', (req, res) => {
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    res.send(user);
});

//Crear un usuario
app.post('/api/users', (req, res) => {
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
app.put('/api/users/:id', (req, res) => {
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
app.delete('/api/users/:id', (req, res) => {
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