import { Point } from './entities/point.mongo.entity';

export const UploadProviders = [
    {
        provide: 'POINT_REPOSITORY',
        useFactory: async (AppDataSource) => await AppDataSource.getRepository(Point),
        inject: ['MONGODB_DATA_SOURCE'],
    },
];

