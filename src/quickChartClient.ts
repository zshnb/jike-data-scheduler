import { Injectable } from '@nestjs/common'
import { Data } from '@prisma/client'
import { format } from 'date-fns'

@Injectable()
export class QuickChartClient {
  constructor() {}

  async generateLineChart(data: Data[]) {
    const postData = {
      width: '900',
      height: '300',
      devicePixelRatio: 1,
      format: 'webp',
      backgroundColor: 'transparent',
      version: '4',
      chart: {
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
      },
    }

    const resp = await fetch(`https://quickchart.io/chart/create`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
    if (!resp.ok) {
      const quickchartError = resp.headers.get('x-quickchart-error')
      const details = quickchartError ? `\n${quickchartError}` : ''
      throw new Error(
        `Chart short url creation failed with status code ${resp.status}${details}`,
      )
    }

    const json = (await resp.json()) as
      | undefined
      | { success?: boolean; url?: string }
    if (!json || !json.success || !json.url) {
      throw new Error('Received failure response from chart shorturl endpoint')
    } else {
      return json.url
    }
  }
}
