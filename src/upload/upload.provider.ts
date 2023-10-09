import { Upload } from './entities/upload.mongo.entity';

export const UploadProviders = [
    {
        provide: 'UPLOAD_REPOSITORY',
        useFactory: async (AppDataSource) => await AppDataSource.getRepository(Upload),
        inject: ['MONGODB_DATA_SOURCE'],
    },
];

