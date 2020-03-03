"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const post_1 = __importDefault(require("./routes/post"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const server = new server_1.default();
const PORT = process.env.PORT || 3000;
const app = express_1.default();
///body Parser
//agregar server antes
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
///FileUpload
app.use(express_fileupload_1.default({ useTempFiles: true }));
///cors configurar
app.use(cors_1.default({ origin: true, credentials: true }));
///rutas de la app
app.use('/user', usuario_1.default);
app.use('/posts', post_1.default);
//Conectar DB
mongoose_1.default.connect('mongodb+srv://ismael:nanocore32100@cluster0-uyiks.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
//Levantar express
/*server.start(() => {
    console.log(`servidor en ${PORT}`);
})

*/
app.listen(PORT);
