import { Inject, Injectable } from '@nestjs/common';
import { Point } from './entities/point.mongo.entity';
import { MongoRepository } from 'typeorm';
import { PointDto } from './dtos/point.dto';



@Injectable()
export class PointService {
    constructor(
        @Inject('POINT_REPOSITORY')
        private pointRepository: MongoRepository<Point>
    ) { }

    async save(dto: PointDto[]) {

        await this.pointRepository.save(dto)

        return {
            success: true
        }
    }

    async get({ eventType }: PointDto) {

        const [data, count] = await this.pointRepository.findAndCount({
            where: {
                eventType,
            }
        })

        // const result = await this.pointRepository.find({ 'param.url': 'http://localhost:5173/list' })

        return {
            data,
            count
        }
    }

}

