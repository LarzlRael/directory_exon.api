import { Test, TestingModule } from '@nestjs/testing';
import { PymesService } from './pymes.service';

describe('PymesService', () => {
  let service: PymesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PymesService],
    }).compile();

    service = module.get<PymesService>(PymesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
