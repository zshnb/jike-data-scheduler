import { Module } from '@nestjs/common'
import { DataService } from './data.service'
import { DataController } from './data.controller'
import { JikeClient } from '../jikeClient'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [DataService, PrismaService, JikeClient],
  controllers: [DataController],
})
export class DataModule {}
