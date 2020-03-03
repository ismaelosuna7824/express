import { Schema, Document, model } from 'mongoose';


const postSchema = new Schema({

    created: {
        type: Date
    }, 
    mensaje: {
        type: String
    },
    img: [{
        type: String
    }],
    coords: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'Debe de existir un ID' ]
    }


});


postSchema.pre<Ipost>('save', function(next){
    this.created = new Date();
    next();
})


interface Ipost extends Document{

    created: Date;
    mensaje: string
    img: string[];
    coords: string;
    usuario: string;
}


export const Post = model<Ipost>('Post', postSchema);