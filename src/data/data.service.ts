import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { PrismaService } from '../prisma.service'
import { JikeClient } from '../jikeClient'

@Injectable()
export class DataService {
  constructor(
    private prisma: PrismaService,
    private jikeClient: JikeClient,
  ) {}

  async fetchFollowerCount() {
    const users = await this.prisma.user.findMany()
    for (const user of users) {
      let refreshToken = user.jikeRefreshToken
      let accessToken = user.jikeAccessToken
      try {
        const profile = await this.jikeClient.getProfile({
          accessToken,
          refreshToken,
        })
        if ('accessToken' in profile) {
          accessToken = profile.accessToken
          refreshToken = profile.refreshToken
        }
        await this.prisma.user.update({
          data: {
            username: profile.user.screenName,
            jikeAccessToken: accessToken,
            jikeRefreshToken: refreshToken,
          },
          where: {
            id: user.id,
          },
        })
        await this.prisma.data.create({
          data: {
            followerCount: profile.user.statsCount.followedCount,
            userId: user.id,
            date: new Date().getTime(),
          },
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
