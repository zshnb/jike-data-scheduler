import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './user.dto'
import { PrismaService } from '../prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    await this.prisma.user.create({
      data: {
        jikeAccessToken: dto.accessToken,
        jikeRefreshToken: dto.refreshToken,
        username: '',
      },
    })
  }
}
