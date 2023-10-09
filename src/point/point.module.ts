import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { ShareModule } from '../shared/shared.module';
import { UploadProviders } from './point.provider';

@Module({
  imports: [ShareModule],
  controllers: [PointController],
  providers: [PointService, ...UploadProviders]
})
export class PointModule { }
