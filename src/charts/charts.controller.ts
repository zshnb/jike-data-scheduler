import { Controller, Get, Query } from '@nestjs/common'
import { ChartsService } from './charts.service'

@Controller('charts')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Get('/follower')
  async getFollowerChart(@Query('username') username: string) {
    return this.chartsService.getFollowerChart(username)
  }
}
