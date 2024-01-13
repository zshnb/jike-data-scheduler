import { Controller, Get, Query } from '@nestjs/common'
import { ChartsService } from './charts.service'

@Controller('charts')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Get('/follower')
  async getFollowerChart(
    @Query('username') username: string,
    @Query('notionIntegrationKey') notionIntegrationKey?: string,
    @Query('databaseId') databaseId?: string,
  ) {
    return this.chartsService.getFollowerChart({
      username,
      notionIntegrationKey,
      databaseId,
    })
  }
}
