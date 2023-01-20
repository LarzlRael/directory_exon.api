import { Schema } from 'mongoose';

export const PymeSchema = new Schema(
  {
    nombre: String,
    propietario: String,
    categoria: String,
    email: String,
    telefono: String,
    localizacion: String,
    direccion: String,
    visible: {
      type: Boolean,
      default: true,
    },
    urlImages: [{ type: String }],
    urlNegocio: String,
    description: String,
    profileImage: String,
    departamento: String,
    redes_sociales: [{ nombre: String, urlRedSocial: String }],
    verificado: {
      type: String,
      default: 'no_verificado',
    },
    idUser: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
