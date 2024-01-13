import { Injectable } from '@nestjs/common'
import { Client } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export type AppendRecords = {
  key: string
  databaseId: string
  records: Record[]
}

export type Record = {
  followerCount: number
  followerIncrement: number
  username: string
  date: string
}
@Injectable()
export class NotionClient {
  private client: Client

  async getDatabaseRecords(params: Pick<AppendRecords, 'key' | 'databaseId'>) {
    try {
      const { key, databaseId } = params
      this.client = new Client({
        auth: key,
      })
      const records = await this.client.databases.query({
        database_id: databaseId,
      })

      return records.results.map((it) => {
        if (it.object === 'page') {
          const richText = (it as PageObjectResponse).properties['日期']
          if (richText.type === 'rich_text') {
            return richText.rich_text[0].plain_text
          } else {
            return ''
          }
        } else {
          return ''
        }
      })
    } catch (e) {
      console.error('get database records error', e)
      return []
    }
  }

  async appendRecords(appendRecords: AppendRecords) {
    try {
      const { key, databaseId, records } = appendRecords
      this.client = new Client({
        auth: key,
      })

      const promises = records.map((it) => {
        return this.client.pages.create({
          parent: {
            type: 'database_id',
            database_id: databaseId,
          },
          properties: {
            用户名: {
              type: 'title',
              title: [
                {
                  text: {
                    content: it.username,
                  },
                },
              ],
            },
            累计粉丝数: {
              type: 'number',
              number: it.followerCount,
            },
            昨日新增粉丝数: {
              type: 'number',
              number: it.followerIncrement,
            },
            日期: {
              type: 'rich_text',
              rich_text: [
                {
                  text: {
                    content: it.date,
                  },
                },
              ],
            },
          },
        })
      })
      await Promise.all(promises)
    } catch (e) {
      console.error('create page in database error', e)
    }
  }
}
