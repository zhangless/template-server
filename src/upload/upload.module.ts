import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UploadProviders } from './upload.provider'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ShareModule } from '../shared/shared.module';

@Module({
  imports: [MulterModule.register({
    storage: diskStorage({
      destination: join(__dirname, '../images'),
      filename: (req, file, cb) => {
        const filename = `${new Date().getTime()}` + extname(file.originalname)
        return cb(null, filename)
      }
    })
  }), ShareModule],
  controllers: [UploadController],
  providers: [UploadService, ...UploadProviders]
})
export class UploadModule { }
