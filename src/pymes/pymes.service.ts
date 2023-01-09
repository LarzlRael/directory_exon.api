import { Injectable, UploadedFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiResponse, v2 } from 'cloudinary';
import { Model } from 'mongoose';
import { PymeDTO, RedesSocialesDto } from './dto/pyme.dto';
import { PymeModel } from './interfaces/project.interface';
import { verifyValidId, swapArrayElements } from '../utils';
import { User } from 'src/auth/dto/schema/User.interface';
import { Verify } from './verify.enum';

import toStream = require('buffer-to-stream');

@Injectable()
export class PymesService {
  constructor(@InjectModel('Pymes') private pymeModel: Model<PymeModel>) {}

  async addnewPyme(pymeDTO: PymeDTO, user: User) {
    const pyme = new this.pymeModel(pymeDTO);
    pyme.idUser = user._id;
    return await pyme.save();
  }
  async getOnePymeByName(nombre: string): Promise<PymeModel> {
    const onePyme = await this.pymeModel
      .findOne({
        nombre,
      })
      .populate('Users');
    return onePyme;
  }
  async getAllPymes() {
    const allPymes = await this.pymeModel
      .find()
      .sort({ verificado: 'desc' })
      .populate('Users');
    return allPymes;
  }
  async findPymeByField(
    field: string,
    query: string,
    field2: string,
    query2: string,
  ) {
    if (query.length === 0) {
      return await this.getAllPymes();
    } else {
      return await this.pymeModel.find({
        [field]: { $regex: '.*' + query + '.*' },
        [field2]: { $regex: '.*' + query2 + '.*' },
      });
    }
  }

  async addSocialNetworks(
    id: string,
    socialNetworks: RedesSocialesDto,
  ): Promise<boolean> {
    const getPyme = await this.pymeModel.findOne({ _id: id });

    if (verifyValidId(id)) {
      if (getPyme) {
        getPyme.redes_sociales.push(socialNetworks);
        await getPyme.save();
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async addImages(
    id: string,
    @UploadedFile() files: Array<Express.Multer.File>,
  ): Promise<boolean> {
    const getPyme = await this.pymeModel.findOne({ _id: id });

    if (getPyme == null || getPyme == undefined) {
      return false;
    }
    files.forEach((file) => {
      let uploadApiResponse: UploadApiResponse;

      const upload = v2.uploader.upload_stream(
        { folder: 'neo_directorio' },
        async (error, result) => {
          if (error) {
            console.log(error);
            return false;
          }
          uploadApiResponse = result;
          try {
            getPyme.urlImages.push(uploadApiResponse.url);
            await getPyme.save();
          } catch (error) {
            console.log(error);
          }
        },
      );

      toStream(file.buffer).pipe(upload);
    });
    return true;
  }

  async addProfileImage(
    id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<boolean> {
    const getPyme = await this.pymeModel.findOne({ _id: id });
    if (!verifyValidId(id)) {
      return false;
    }
    if (getPyme == null || getPyme == undefined) {
      return false;
    }

    let uploadApiResponse: UploadApiResponse;

    const upload = v2.uploader.upload_stream(
      { folder: 'profiles_images' },
      async (error, result) => {
        if (error) {
          console.log(error);
          return false;
        }
        uploadApiResponse = result;

        try {
          getPyme.profileImage = uploadApiResponse.url;
          await getPyme.save();
        } catch (error) {
          console.log(error);
        }
      },
    );

    toStream(file.buffer).pipe(upload);

    return true;
  }
  async changeMainImage(id: string, index: number): Promise<boolean> {
    const currentPyme = await this.pymeModel.findOne({ _id: id });

    if (index >= currentPyme.urlImages.length) {
      return false;
    }

    /* console.log(JSON.stringify(currentPyme.urlImages, null, " ")); */

    try {
      await this.pymeModel.findByIdAndUpdate(
        { _id: id },
        {
          urlImages: swapArrayElements(currentPyme.urlImages, 0, index),
        },
      );

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async verifyPyme(id: string): Promise<boolean> {
    if (!verifyValidId(id)) {
      return false;
    }

    try {
      await this.pymeModel.findByIdAndUpdate(
        { _id: id },
        { verificado: Verify.VERIFICADO },
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
