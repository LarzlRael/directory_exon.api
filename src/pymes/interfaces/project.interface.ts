import { Verify } from '../verify.enum';
export interface PymeModel extends Document {
  nombre: string;
  propietario: string;
  categoria: string;
  urlNegocio: string;

  urlImages: string[];
  email: string;

  telefono: string;
  localizacion: string;
  coords: { lat: string; lng: string };
  direccion: string;
  description: string;
  departamento: string;
  urlImage: string;
  profileImage: string;
  redes_sociales: RedesSocialesDto[];
  verificado: Verify;
  idUser: string;
}

export interface RedesSocialesDto {
  nombre: string;
  urlRedSocial: string;
}
