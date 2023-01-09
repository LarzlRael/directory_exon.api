import { Test, TestingModule } from '@nestjs/testing';
import { PymesController } from './pymes.controller';

describe('PymesController', () => {
  let controller: PymesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PymesController],
    }).compile();

    controller = module.get<PymesController>(PymesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
