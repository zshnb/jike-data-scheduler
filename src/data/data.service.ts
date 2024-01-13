import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { JikeClient } from '../jikeClient'
import { Cron } from '@nestjs/schedule'
import { FollowerData } from './data'
import { format } from 'date-fns'

@Injectable()
export class DataService {
  constructor(
    private prisma: PrismaService,
    private jikeClient: JikeClient,
  ) {}

  @Cron('0 23 * * *')
  async fetchFollowerCount() {
    console.log('start fetch followerCount')
    const users = await this.prisma.user.findMany()
    for (const user of users) {
      if (user.username === '') {
        console.log(`start fetch new user follower count`)
      } else {
        console.log(`start fetch ${user.username} follower count`)
      }
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
        const existData = await this.prisma.data.findMany({
          select: {
            id: true,
            followerCount: true,
          },
          where: {
            userId,
          },
          orderBy: {
            date: 'desc',
          },
          take: 1,
        })
        if (existData.length > 0) {
          await this.prisma.data.update({
            data: {
              followerIncrement:
                profile.user.statsCount.followedCount -
                existData[0].followerCount,
            },
            where: {
              id: existData[0].id,
            },
          })
        }
        await this.prisma.data.create({
          data: {
            followerCount: profile.user.statsCount.followedCount,
            userId,
            date: new Date().getTime(),
          },
        })
      } catch (e) {
        console.error(e)
      }
      if (user.username === '') {
        console.log(`end fetch new user follower count`)
      } else {
        console.log(`end fetch ${user.username} follower count`)
      }
    }
  }

  async getFollowerCount(username: string): Promise<FollowerData[]> {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    })
    if (user === null) {
      return []
    } else {
      const data = await this.prisma.data.findMany({
        where: {
          userId: user.id,
        },
      })
      return data.map((it) => {
        return {
          count: it.followerCount,
          username,
          datetime: format(Number(it.date), 'yyyy-MM-dd'),
        }
      })
    }
  }
}
