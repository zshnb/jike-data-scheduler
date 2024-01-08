import { Module } from '@nestjs/common'
import { DataService } from './data.service'
import { DataController } from './data.controller'
import { JikeClient } from '../jikeClient'

@Module({
  providers: [DataService, JikeClient],
  controllers: [DataController],
})
export class DataModule {}
