import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { JikeClient } from '../jikeClient'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class DataService {
  constructor(
    private prisma: PrismaService,
    private jikeClient: JikeClient,
  ) {}

  @Cron('0 0 * * *')
  async fetchFollowerCount() {
    console.log('start fetch followerCount')
    const users = await this.prisma.user.findMany()
    for (const user of users) {
      let refreshToken = user.jikeRefreshToken
      let accessToken = user.jikeAccessToken
      let userId = user.id
      try {
        const profile = await this.jikeClient.getProfile({
          accessToken,
          refreshToken,
        })
        if ('accessToken' in profile) {
          accessToken = profile.accessToken
          refreshToken = profile.refreshToken
        }
        const mayExistUser = await this.prisma.user.findFirst({
          where: {
            username: profile.user.screenName,
          },
        })
        if (mayExistUser !== null) {
          userId = mayExistUser.id
          this.prisma.user.delete({
            where: {
              id: user.id,
            },
          })
        }
        await this.prisma.user.update({
          data: {
            username: profile.user.screenName,
            jikeAccessToken: accessToken,
            jikeRefreshToken: refreshToken,
          },
          where: {
            id: userId,
          },
        })
        await this.prisma.data.create({
          data: {
            followerCount: profile.user.statsCount.followedCount,
            userId: userId,
            date: new Date().getTime(),
          },
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
