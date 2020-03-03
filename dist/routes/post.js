"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const PostRoutes = express_1.Router();
const fileSysem = new file_system_1.default();
//Obtener posts
PostRoutes.get('/posts', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    resp.json({
        ok: true,
        pagina,
        posts
    });
}));
///crear posts
PostRoutes.post('/', [auth_1.verificaToken], (req, resp) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSysem.imagenesDeTempHaciaPost(req.usuario._id);
    ///el img lo toma de como se llama el modelo
    body.img = imagenes;
    //modelo, el post db es la informacion que devuelve la DB
    post_model_1.Post.create(body).then((postDb) => __awaiter(void 0, void 0, void 0, function* () {
        ///devuelve toda la informacion del usuaeio 
        yield postDb.populate('usuario', '-password').execPopulate();
        ///
        resp.json({
            ok: true,
            post: postDb
        });
    })).catch(err => {
        resp.json(err);
    });
});
///servicio para subir archivos
PostRoutes.post('/upload', [auth_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No es una imagen'
        });
    }
    ///obtiene el file y el id del usuario
    yield fileSysem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
PostRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSysem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = PostRoutes;
