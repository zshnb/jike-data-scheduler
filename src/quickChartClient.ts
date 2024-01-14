import { Injectable } from '@nestjs/common'
import QuickChart from 'quickchart-js'
import { Data } from '@prisma/client'
import { format } from 'date-fns'

@Injectable()
export class QuickChartClient {
  constructor() {}

  generateLineChart(data: Data[]) {
    const quickChart = new QuickChart('', '')
    quickChart
      .setConfig({
        type: 'line',
        data: {
          labels: data.map((it) => format(Number(it.date), 'yyyy-MM-dd')),
          datasets: [
            {
              label: '累计粉丝数',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: data.map((it) => it.followerCount),
              fill: false,
            },
            {
              label: '昨日新增粉丝数',
              fill: false,
              backgroundColor: 'rgb(54, 162, 235)',
              borderColor: 'rgb(54, 162, 235)',
              data: data.map((it) => it.followerIncrement),
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Chart.js Line Chart',
          },
        },
      })
      .setWidth(1280)
      .setWidth(720)
      .setBackgroundColor('transparent')
      .setVersion('4')
      .setFormat('webp')
    return quickChart.getShortUrl()
  }
}
