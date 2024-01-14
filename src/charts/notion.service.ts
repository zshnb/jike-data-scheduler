import { Injectable } from '@nestjs/common'
import { AppendEmbedBlock, AppendRecords, NotionClient } from '../notionClient'
import type { Data } from '@prisma/client'
import { format } from 'date-fns'
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

@Injectable()
export class NotionService {
  constructor(private readonly notionClient: NotionClient) {}

  async appendRecordToDatabase(
    appendRecords: Pick<AppendRecords, 'key' | 'databaseId'>,
    data: Data[],
    username: string,
  ) {
    const existRecords =
      await this.notionClient.getDatabaseRecords(appendRecords)
    const waitForAppendData = data
      .filter(
        (it) => !existRecords.includes(format(Number(it.date), 'yyyy-MM-dd')),
      )
      .sort((a, b) => (a < b ? -1 : 1))
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

  async appendImageToPage({ key, pageId, url }: AppendEmbedBlock) {
    const blocks = await this.notionClient.getPageBlocks({
      key,
      pageId,
    })
    const embedBlock = blocks.find(
      (it) => (it as BlockObjectResponse).type === 'embed',
    )
    if (embedBlock) {
      await this.notionClient.replaceEmbedUrl({
        blockId: embedBlock.id,
        key,
        url,
      })
    } else {
      await this.notionClient.appendEmbedChildToPage({
        pageId,
        key,
        url,
      })
    }
  }
}
