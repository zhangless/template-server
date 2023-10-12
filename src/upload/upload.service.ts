import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UploadDto } from './dtos/upload.dto';
import { MongoRepository } from 'typeorm';
import { Upload } from './entities/upload.mongo.entity'
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {

    constructor(
        @Inject('UPLOAD_REPOSITORY')
        private uploadRepository: MongoRepository<Upload>
    ) { }

    staicBaseUrl = process.env.APP_ENV === 'development' ? 'http://localhost:7002/res/' : 'http://api.ricedog.top/res/'


    async upload(dto: UploadDto) {
        const findRes = await this.findAllPicture(dto)
        if (findRes.count >= 20) {
            const filePath = join(__dirname, '../images', dto.address)
            try {
                // 删除文件
                await fs.unlink(filePath);
            } catch (err) {
                console.error('Error in deleting file:', err);
                throw err;
            }
            throw new HttpException('数量达到上限', HttpStatus.SERVICE_UNAVAILABLE)
        }
        const has = await this.uploadRepository.findOneBy({ id: dto.id })
        if (!has) {
            // 判断是否存在
            const count = await this.uploadRepository.count()
            dto.id = count + 1
            await this.uploadRepository.save(dto)
        } else {
            await this.uploadRepository.updateOne({ id: dto.id }, { $set: dto })
        }
        return {
            address: dto.address,
            realPath: `${this.staicBaseUrl}${dto.address}`
        }
    }

    async findAllPicture({ userId }: UploadDto) {
        const [data, count] = await this.uploadRepository.findAndCount({
            where: {
                userId
            }
        })
        return {
            data: data.map(item => {
                return {
                    address: item.address,
                    realPath: `${this.staicBaseUrl}${item.address}`
                }
            }),
            count
        }
    }


    async deletePicture({ address, userId }: UploadDto) {
        const filePath = join(__dirname, '../images', address)
        try {
            // 删除文件
            await fs.unlink(filePath);
        } catch (err) {

        }
        await this.uploadRepository.delete({
            address,
        })
        return {
            isOK: 1
        }
    }
}
