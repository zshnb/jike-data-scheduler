import { Controller, Get, Post, Query } from '@nestjs/common'
import { DataService } from './data.service'

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}
  @Post('/followerCount')
  async fetchFollowerCount() {
    await this.dataService.fetchFollowerCount()
    return {
      data: 'success',
    }
  }

  @Get('/followerCount')
  async getFollowerCount(@Query('username') username: string) {
    return this.dataService.getFollowerCount(username)
  }
}
