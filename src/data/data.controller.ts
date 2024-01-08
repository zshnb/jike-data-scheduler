import { Controller, Post } from '@nestjs/common'
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
}
