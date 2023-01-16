import {
  Injectable,
  InternalServerErrorException,
  UploadedFile,
} from '@nestjs/common';
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
    idUser: string,
  ) {
    const getPyme = await this.pymeModel.findOne({ _id: id });

    if (getPyme == null || getPyme == undefined) {
      new InternalServerErrorException('not found pyme with that id');
    }
    if (!files) {
      new InternalServerErrorException('Theres is no files');
    }

    await Promise.all(
      files.map(async (file) => {
        console.log(file);
        let uploadApiResponse: UploadApiResponse;

        const upload = v2.uploader.upload_stream(
          { folder: 'neo_directorio' },
          async (error, result) => {
            console.log(result);
            if (error) {
              return new InternalServerErrorException(error);
            }
            uploadApiResponse = result;
            try {
              getPyme.idUser = idUser;
              getPyme.categoria = 'pyme2';
              getPyme.urlImages.push(uploadApiResponse.secure_url);

              const saved = await getPyme.save();

              return saved;
            } catch (error) {
              console.log(error);
              return new InternalServerErrorException(error);
            }
          },
        );
        toStream(file.buffer).pipe(upload);
      }),
    );
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
  async changeMainImage(id: string, index: number) {
    const currentPyme = await this.pymeModel.findOne({ _id: id });

    if (index >= currentPyme.urlImages.length) {
      new InternalServerErrorException("index doesn't exist");
    }

    try {
      await this.pymeModel.findByIdAndUpdate(
        { _id: id },
        {
          urlImages: swapArrayElements(currentPyme.urlImages, 0, index),
        },
      );
    } catch (error) {
      new InternalServerErrorException(error);
      console.log(error);
    }
  }
  async updatePyme(id: string, pymeDTO: PymeDTO): Promise<boolean> {
    if (!verifyValidId(id)) {
      return false;
    }
    const currentPyme = await this.pymeModel.findOne({ _id: id });

    if (currentPyme == null || currentPyme == undefined) {
      return false;
    }
    delete pymeDTO._id;
    await this.pymeModel.findByIdAndUpdate(id, { ...pymeDTO });
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
