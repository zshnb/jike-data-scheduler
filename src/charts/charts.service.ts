import { Injectable } from '@nestjs/common'
import { format } from 'date-fns'
import { PrismaService } from '../prisma.service'
import * as echarts from 'echarts'
import { AppendRecords, NotionClient } from '../notionClient'
import type { Data } from '@prisma/client'
import { GetFollowerChart } from './charts'

@Injectable()
export class ChartsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notionClient: NotionClient,
  ) {}

  async getFollowerChart(params: GetFollowerChart) {
    const { username, notionIntegrationKey, databaseId } = params
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    })
    if (user === null) {
      return ''
    } else {
      const data = await this.prisma.data.findMany({
        where: {
          userId: user.id,
        },
      })
      if (notionIntegrationKey && databaseId) {
        this.appendRecordToNotion(
          {
            key: notionIntegrationKey,
            databaseId,
          },
          data,
          username,
        )
      }
      const xAxis = {
        type: 'category',
        data: data.map((it) => format(Number(it.date), 'yyyy-MM-dd')),
      }
      const yAxis = {
        type: 'value',
      }
      const series = [
        {
          type: 'line',
          data: data.map((it) => it.followerCount),
        },
      ]
      const option = {
        xAxis,
        yAxis,
        series,
      }
      let chart = echarts.init(null, null, {
        renderer: 'svg', // 必须使用 SVG 模式
        ssr: true, // 开启 SSR
        width: 1280, // 需要指明高和宽
        height: 720,
      })
      chart.setOption(option)
      const svgStr = chart.renderToSVGString()

      chart.dispose()
      chart = null
      return svgStr
    }
  }

  async appendRecordToNotion(
    appendRecords: Pick<AppendRecords, 'key' | 'databaseId'>,
    data: Data[],
    username: string,
  ) {
    const existRecords =
      await this.notionClient.getDatabaseRecords(appendRecords)
    const waitForAppendData = data.filter(
      (it) => !existRecords.includes(format(Number(it.date), 'yyyy-MM-dd')),
    )
    console.log(
      `${username} exist records: ${existRecords.length}, append data: ${waitForAppendData.length}`,
    )
    await this.notionClient.appendRecords({
      ...appendRecords,
      records: waitForAppendData.map((it) => {
        return {
          ...it,
          date: format(Number(it.date), 'yyyy-MM-dd'),
          username,
        }
      }),
    })
  }
}
