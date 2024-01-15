import { Module } from '@nestjs/common'
import { JikeService } from './jike.service'
import { JikeController } from './jike.controller'
import { UserService } from '../user/user.service'
import { PrismaService } from '../prisma.service'

@Module({
  providers: [JikeService, UserService, PrismaService],
  controllers: [JikeController],
})
export class JikeModule {}
