import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PointService } from './point.service';

@Controller('api/point')
export class PointController {
  constructor(private readonly pointService: PointService) {

  }

  @Post()
  async saveData(@Body() body) {
    const pointArr = body.data.map(item => ({
      eventType: item.eventType,
      param: item,
      ...item
    }))





    const res = await this.pointService.save(pointArr)

    return res

  }

  @Get()
  async getData(@Query() query) {

    const { eventType } = query

    const res = await this.pointService.get({ eventType })

    return res

  }


}
