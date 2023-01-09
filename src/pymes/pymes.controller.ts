import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PymesService } from './pymes.service';
import { Response } from 'express';
import { PymeDTO, RedesSocialesDto } from './dto/pyme.dto';
import { Body, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from '../utils';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/auth/dto/schema/User.interface';

@Controller('pymes')
export class PymesController {
  constructor(private pymeService: PymesService) {}
  @Get()
  getAllPymesInfo() {
    return this.pymeService.getAllPymes();
  }

  /* @Get('/:nombre/:departament') */
  @Get('/:nombre/')
  getOne(@Param('nombre') nombre) {
    return this.pymeService.getOnePymeByName(nombre);
  }

  @Get('/:field/:query/:field2/:query2')
  findOPyme(
    @Param('field') nombre,
    @Param('query') query: string,
    @Param('field2') nombre2,
    @Param('query2') query2: string,
  ) {
    if (query.length === 0) {
      return this.pymeService.getAllPymes();
    } else {
      return this.pymeService.findPymeByField(nombre, query, nombre2, query2);
    }
  }

  @Post('/newPyme')
  @UseGuards(AuthGuard('jwt'))
  async newPyme(
    @Res() res: Response,
    @Body() pymeDTO: PymeDTO,
    @GetUser() user: User,
  ) {
    await this.pymeService.addnewPyme(pymeDTO, user);
    return res.json({
      ok: true,
      message: 'nueva pyme agregada correctamente',
    });
  }

  @Post('/addSocialNetwork/:id')
  @UseGuards(AuthGuard('jwt'))
  async addSocialNetwork(
    @Res() res: Response,
    @Param('id') id,
    @Body() socialNetWork: RedesSocialesDto,
  ) {
    if (await this.pymeService.addSocialNetworks(id, socialNetWork)) {
      res.json({
        ok: true,
        message: 'red social agregada',
      });
    } else {
      res.json({
        ok: false,
        message: 'no se encontro el id',
      });
    }
  }

  @Post('/addedImage/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      fileFilter: imageFileFilter,
    }),
  )
  async addImages(
    @Param('id') id,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.pymeService.addImages(id, files);
  }

  @Post('/addProfile/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  async addProfileImage(
    @Res() res: Response,
    @Param('id') id,
    @UploadedFile() fileProfileImage: Express.Multer.File,
  ) {
    if (await this.pymeService.addProfileImage(id, fileProfileImage)) {
      res.status(HttpStatus.OK).json({
        ok: true,
        msg: 'Imagen de perfil agregada',
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        msg: 'Error al subir imagen',
      });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/changeMainImage/:id/:index')
  async changeMainImage(
    @Res() res: Response,
    @Param('id') id,
    @Param('index') index,
  ) {
    if (await this.pymeService.changeMainImage(id, index)) {
      res.json({
        ok: true,
        message: 'Imagen principal cambiada',
      });
    } else {
      res.json({
        ok: false,
        message: 'hubo un error',
      });
    }
  }

  @Get('/verificarPyme/:id')
  @UseGuards(AuthGuard('jwt'))
  async verifyPyme(@Res() res: Response, @Param('id') id) {
    if (await this.pymeService.verifyPyme(id)) {
      res.json({
        ok: true,
        message: 'Pyme Verificado',
      });
    } else {
      res.json({
        ok: false,
        message: 'hubo un error',
      });
    }
  }
}
