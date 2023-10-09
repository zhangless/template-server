import { UploadService } from './upload.service';
import { Controller, Post, UploadedFile, UseInterceptors, HttpCode, UseGuards, Req, Body, Delete, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { promises as fs } from 'fs'
import path, { join, extname } from 'path'
import { AuthGuard } from '@nestjs/passport';
import { UploadDto } from './dtos/upload.dto';

@Controller('api/upload')
@ApiTags('上传图片')
export class UploadController {
    constructor(private readonly UploadService: UploadService) { }

    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @HttpCode(200)
    async uploadFile(@UploadedFile() file, @Req() req) {
        const dto = {
            userId: req.user.id,
            address: file.filename
        }
        const uploadResult = this.UploadService.upload(dto)
        return uploadResult
    }


    @Get()
    @ApiBearerAuth()
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async findAllPic(@Req() req) {
        const dto = {
            userId: req.user.id,
        }
        return this.UploadService.findAllPicture(dto)
    }

    @ApiOperation({
        summary: '删除图片',
    })
    @ApiBearerAuth()
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @Delete(':address')
    async delPic(@Param('address') address: string, @Req() req) {
        const dto = {
            userId: req.user.id,
            address: address
        }
        return this.UploadService.deletePicture(dto)

    }
}

