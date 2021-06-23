const express = require('express');
const config = require('config');
const morgan = require('morgan');
const logger = require('./logger');
const users = require('./routes/users')
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(logger);
app.use('/api/users', users)

//Configuracion de entornos
console.log('La aplicación: ' + config.get('nombre'));
//Uso de middleware
app.use(morgan('tiny'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Esuchando en el puerto', port, '...');
})

app.get('/', (req, res) => {
    console.log('Hola mundo');
});







