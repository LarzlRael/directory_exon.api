import {
  IsEmail,
  IsEnum,
  IsLatLong,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Verify as VerifyType, RedSocial } from '../verify.enum';
import { departamentEnum } from '../../utils';
export class PymeDTO {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  propietario: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsUrl()
  @IsOptional()
  urlNegocio: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(departamentEnum)
  @IsNotEmpty()
  departamento: departamentEnum;

  @IsOptional()
  urlImages: string[];
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  telefono: string;

  @IsString()
  @IsOptional()
  direccion: string;

  @IsString()
  @IsOptional()
  redes_sociales: RedesSocialesDto[];

  @IsEnum(VerifyType)
  verificado: VerifyType;

  @IsOptional()
  @IsLatLong()
  localizacion: string;

  _id: string;
}

export class RedesSocialesDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(RedSocial)
  nombre: RedSocial;

  @IsUrl()
  @IsNotEmpty()
  urlRedSocial: string;
}

export class localizacion {
  lat: string;
  lng: string;
}
