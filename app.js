const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());
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
    userID = parseInt(req.params.id);
    let user = users.find(user => user.id === userID);
    if(!user) res.status(404).send('El usuario no fue encontrado');
    res.send(user);
});

//Crear un usuario
app.post('/api/users', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    const {error, value} = schema.validate({ name: req.body.name });

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
    userID = parseInt(req.params.id);
    let user = users.find(user => user.id === userID);
    if(!user) res.status(404).send('El usuario no fue encontrado');

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    const {error, value} = schema.validate({ name: req.body.name });
    if(error){
        res.status(400).send(error.message);
        return;
    }

    user.name = value.name;
    res.send(user);
});

