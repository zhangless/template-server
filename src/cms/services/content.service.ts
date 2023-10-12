import { Injectable, Inject, Query } from '@nestjs/common';
import { In, Like, Raw, MongoRepository, ObjectID } from 'typeorm';
import { Content } from '../entities/content.mongo.entity'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'
import { CreateContentDto, UpdateContentDto } from '../dtos/content.dto';
import * as puppeteer from 'puppeteer'
import { join } from 'path'
import { ensureDir, outputFile } from 'fs-extra'
import axios from 'axios';


@Injectable()
export class ContentService {
  constructor(
    @Inject('CONTENT_REPOSITORY')
    private contentRepository: MongoRepository<Content>
  ) { }


  async create(dto: CreateContentDto) {
    const has = await this.contentRepository.findOneBy({ id: dto.id })
    let ret
    if (!has) {
      // 判断是否存在
      const count = await this.contentRepository.count()
      dto.id = count + 1
      dto['isDelete'] = false
      ret = await this.contentRepository.save(dto)
    } else {
      ret = await this.contentRepository.updateOne({ id: dto.id }, { $set: dto })
    }


    return dto
  }

  async findAll({ pageSize, page, userId }): Promise<{ data: Content[], count: number }> {

    const [data, count] = await this.contentRepository.findAndCount({
      where: {
        userId,
        isDelete: false,
        // type: 'content'
      },

      order: { createAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: (pageSize * 1),
      cache: true
    })


    return {
      data, count
    }
  }


  async findAllPublish(): Promise<{ data: number[], count: number }> {
    const [data, count] = await this.contentRepository.findAndCount({
      where: {
        isDelete: false,
        publish: true
      },
      order: { createAt: 'DESC' },
      cache: true
    })

    return {
      data: data.map((item) => item.id), count
    }
  }

  async findAllTemplate({ pageSize, page, userId }): Promise<{ data: Content[], count: number }> {
    const [data, count] = await this.contentRepository.findAndCount({
      where: {
        // userId,
        isDelete: false,
        type: 'template'
      },
      order: { createAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: (pageSize * 1),
      cache: true
    })

    return {
      data, count
    }
  }

  async findOne(id: string) {
    const ret = await this.contentRepository.findOneBy({
      id: parseInt(id),
      isDelete: false
    })
    return ret
  }

  async update(id: number, dto: UpdateContentDto) {
    const ret = await this.contentRepository.update(id, dto)

    // TODO 暂时使用同步刷新
    // await this.sync(id)
    return ret
  }


  async remove(id: number): Promise<any> {
    const ret = await this.contentRepository.updateOne({ id }, { $set: { isDelete: true } })

    await this.sync(id)
    return ret
  }


  /**
    * 刷新ssg服务
    * @param id 
    */
  async sync(id: number) {
    const secret = `iamvalidatetoken`
    const url = `api/revalidate?secret=${secret}&id=${id}`
    const host = `http://ssgbuilder.codebus.tech`
    console.log('sync nest validate url:', host + '/' + url)
    try {
      console.log('url', url)
      await axios.get(host + '/' + url)
    } catch (error) {
      // console.log(error)
      console.log('同步失败')
      throw error
    }

    return
  }


  /**
   * 截取缩略图
   * @param url 
   * @param id 
   */
  async takeScreenshot(id) {
    // const url = `https://www.baidu.com`
    const url = `http://ssrbuilder.codebus.tech/?id=${id}`
    const host = 'http://template.codebus.tech/'
    const prefix = `static/upload/`
    const imgPath = join(__dirname, '../../../..', prefix)
    await ensureDir(imgPath)
    const thumbnailFilename = `thumb_header_${id}.png`;
    const thumbnailFullFilename = `thumb_full_${id}.png`;
    this.runPuppeteer(url, {
      thumbnailFilename: join(imgPath, thumbnailFilename),
      thumbnailFullFilename: join(imgPath, thumbnailFullFilename)
    })

    const thumbnail = {
      header: host + prefix + thumbnailFilename,
      full: host + prefix + thumbnailFullFilename
    }

    await this.contentRepository.updateOne({ id }, { $set: { thumbnail } })

    return thumbnail

  }

  async runPuppeteer(url, { thumbnailFilename,
    thumbnailFullFilename }) {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--lang=zh-CN',
        '--font-render-hinting=medium',
        '--font-antialiasing=standard',
        `--font-family="WenQuanYi Zen Hei"`

      ], headless: true
    });
    const page = await browser.newPage();

    // 设置打开分辨率
    await page.setViewport({ width: 750, height: 800 });

    await page.goto(url,
      { waitUntil: 'networkidle0' }
    );
    await page.screenshot({
      path: thumbnailFilename
    });

    await page.screenshot({
      fullPage: true, // 是否截全屏
      path: thumbnailFullFilename
    });
    console.log('缩略图生成完成。。。。')
    await browser.close();
  }

}
