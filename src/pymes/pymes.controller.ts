import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PymesService } from './pymes.service';
import { PymeDTO } from './dto/pyme.dto';
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
  @Get('/:nombre')
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
  async newPyme(@Body() pymeDTO: PymeDTO, @GetUser() user: User) {
    await this.pymeService.addnewPyme(pymeDTO, user);
  }
  @Put('/updatePyme/:id')
  @UseGuards(AuthGuard('jwt'))
  async updatePyme(@Body() pymeDTO: PymeDTO, @Param('id') id) {
    await this.pymeService.updatePyme(id, pymeDTO);
  }

  @Post('/addedImage/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      fileFilter: imageFileFilter,
    }),
  )
  addImages(
    @Param('id') id,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetUser() user: User,
  ) {
    return this.pymeService.addImages(id, files, user._id);
  }

  @Put('/addProfile/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  async addProfileImage(
    @Param('id') id,
    @UploadedFile() fileProfileImage: Express.Multer.File,
  ) {
    return this.pymeService.addProfileImage(id, fileProfileImage);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/changeOrderImage/:id')
  async changeMainImage(@Param('id') id, @Body() newOrder: string[]) {
    return this.pymeService.changeMainImage(id, newOrder);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete('/deletePyme/:id')
  async deletePyme(@Param('id') id) {
    return this.pymeService.deletePyme(id);
  }
}
