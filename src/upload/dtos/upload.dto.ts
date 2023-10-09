import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';


export class UploadDto {
    @ApiProperty({ example: '1' })
    userId?: ObjectId;

    @ApiProperty({ example: 'ID' })
    id?: number;

    @ApiProperty({ example: 'http://localhost:3000/1.jpeg' })
    address?: string;

}
