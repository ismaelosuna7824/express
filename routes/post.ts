import { Router, Request, Response } from "express";
import { verificaToken } from '../middlewares/auth';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from "../classes/file-system";


const PostRoutes = Router();
const fileSysem = new FileSystem();

//Obtener posts

PostRoutes.get('/posts', async (req: any, resp: Response) =>{
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10
    
    const posts = await Post.find()
    .sort({_id: -1})
    .skip(skip)
    .limit(10)
    .populate('usuario', '-password')
    .exec();

    resp.json({
        ok: true,
        pagina,
        posts
    });

});


///crear posts
PostRoutes.post('/', [ verificaToken ], (req: any, resp: Response) =>{
    const body = req.body;

    body.usuario = req.usuario._id;

    const imagenes = fileSysem.imagenesDeTempHaciaPost(req.usuario._id);
    ///el img lo toma de como se llama el modelo
    body.img = imagenes;


    //modelo, el post db es la informacion que devuelve la DB
    Post.create(body).then(async postDb =>{
        ///devuelve toda la informacion del usuaeio 
       await  postDb.populate('usuario', '-password').execPopulate();
       ///
        resp.json({
            ok: true,
            post: postDb  
        });
    }).catch(err =>{
        resp.json(err);
    }); 
});

///servicio para subir archivos

PostRoutes.post('/upload', [ verificaToken ], async (req: any, res:Response)=>{
    if(!req.files){
        return res.status(400).json({
            ok: false, 
            mensaje: 'No se subió ningun archivo'
        })
    }

    const file: FileUpload = req.files.image;
    if( !file ){
        return res.status(400).json({
            ok: false, 
            mensaje: 'No se subió ningun archivo - image'
        })
    }
    if( !file.mimetype.includes('image')){
        return res.status(400).json({
            ok: false, 
            mensaje: 'No es una imagen'
        })
    }
    ///obtiene el file y el id del usuario
    await fileSysem.guardarImagenTemporal(file,req.usuario._id);
    
    res.json({
        ok: true,
        file: file.mimetype
    });
});

PostRoutes.get('/imagen/:userid/:img', (req:any, res:Response)=> {
    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto =  fileSysem.getFotoUrl(userId, img);

    res.sendFile(pathFoto);
});


export default PostRoutes;