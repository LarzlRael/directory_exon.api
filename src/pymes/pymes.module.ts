import { Module } from '@nestjs/common';
import { PymesService } from './pymes.service';
import { PymesController } from './pymes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';
import { PymeSchema } from './schema/pymeSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Pymes', schema: PymeSchema }]),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [PymesController],
  providers: [PymesService, CloudinaryProvider],
  exports: [PymesService, CloudinaryProvider],
})
export class PymesModule {}
