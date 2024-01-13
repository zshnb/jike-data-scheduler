import { Module } from '@nestjs/common'
import { ChartsController } from './charts.controller'
import { ChartsService } from './charts.service'
import { PrismaService } from '../prisma.service'
import { NotionClient } from '../notionClient'

@Module({
  controllers: [ChartsController],
  providers: [ChartsService, PrismaService, NotionClient],
})
export class ChartsModule {}
