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

/* @IsString()
@IsNotEmpty()
nombre: string;
propietario: string;
categoria: string;

@IsOptional()
urlNegocio: string;
UrlImages: string[];
@IsEmail()
email: string;

@IsString()
@IsOptional()
telefono: string;
localizacion: string;
direccion: string;
description: string;
redes_sociales: RedesSociales[];

@IsEnum(VerifyType)
verificado: VerifyType; */
