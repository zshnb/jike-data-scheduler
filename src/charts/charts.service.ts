import { Injectable } from '@nestjs/common'
import { format } from 'date-fns'
import { PrismaService } from '../prisma.service'
import * as echarts from 'echarts'

@Injectable()
export class ChartsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFollowerChart(username: string) {
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
        width: 400, // 需要指明高和宽
        height: 300,
      })
      chart.setOption(option)
      const svgStr = chart.renderToSVGString()

      chart.dispose()
      chart = null
      return svgStr
    }
  }
}