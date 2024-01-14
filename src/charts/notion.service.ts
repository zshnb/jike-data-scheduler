import { Injectable } from '@nestjs/common'
import { AppendRecords, NotionClient } from '../notionClient'
import type { Data } from '@prisma/client'
import { format } from 'date-fns'

@Injectable()
export class NotionService {
  constructor(private readonly notionClient: NotionClient) {}
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
