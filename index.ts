import Server from './classes/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import fileUpload from 'express-fileupload';

import PostRoutes from './routes/post';
import userRoutes from './routes/usuario';

import cors from 'cors';

import express from 'express';

const server =  new Server();

const PORT = process.env.PORT || 3000;
const app = express();
///body Parser
//agregar server antes
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
///FileUpload
app.use(fileUpload({useTempFiles: true}));

///cors configurar

app.use(cors({ origin: true, credentials: true }));


///rutas de la app
app.use('/user', userRoutes)
app.use('/posts', PostRoutes)

//Conectar DB
mongoose.connect(process.env.MONGODB || 'mongodb+srv://ismael:nanocore32100@cluster0-uyiks.mongodb.net/test?retryWrites=true&w=majority', 
            { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});


//Levantar express
/*server.start(() => {
    console.log(`servidor en ${PORT}`);
})

*/

app.listen( PORT )