import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';


export class PointDto {

    @ApiProperty({ example: 'ID' })
    id?: number;

    @ApiProperty()
    eventType: string;

    @ApiProperty()
    param?: Object

}
