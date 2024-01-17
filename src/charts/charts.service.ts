import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { GetFollowerChart } from './charts'
import { NotionService } from './notion.service'
import { QuickChartClient } from '../quickChartClient'

@Injectable()
export class ChartsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notionService: NotionService,
    private readonly quickChartClient: QuickChartClient,
  ) {}

  async getFollowerChart(params: GetFollowerChart): Promise<string | null> {
    const { username, notionIntegrationKey, databaseId, pageId } = params
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    })
    if (user === null) {
      return null
    } else {
      const data = await this.prisma.data.findMany({
        where: {
          userId: user.id,
        },
      })
      let url: string
      try {
        url = await this.quickChartClient.generateLineChart(data)
      } catch (e) {
        console.error('generate chart error', e)
        return null
      }
      if (notionIntegrationKey && databaseId && pageId) {
        try {
          this.notionService.appendRecordToDatabase(
            {
              key: notionIntegrationKey,
              databaseId,
            },
            data,
            username,
          )
          this.notionService.appendImageToPage({
            key: notionIntegrationKey,
            pageId,
            url,
          })
        } catch (e) {
          console.error('write data to notion error', e)
          return ''
        }
      }
      return url
    }
  }
}
