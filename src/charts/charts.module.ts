import { Module } from '@nestjs/common'
import { ChartsController } from './charts.controller'
import { ChartsService } from './charts.service'
import { PrismaService } from '../prisma.service'
import { NotionClient } from '../notionClient'
import { NotionService } from './notion.service'
import { QuickChartClient } from '../quickChartClient'

@Module({
  controllers: [ChartsController],
  providers: [
    ChartsService,
    PrismaService,
    NotionClient,
    NotionService,
    QuickChartClient,
  ],
})
export class ChartsModule {}
