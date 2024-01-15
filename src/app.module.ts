import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './configuration'
import { ClsModule } from 'nestjs-cls'
import { DataModule } from './data/data.module'
import { ScheduleModule } from '@nestjs/schedule'
import { UserModule } from './user/user.module'
import { ChartsModule } from './charts/charts.module'
import { JikeModule } from './jike/jike.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`config/.env.${process.env.NODE_ENV}`, 'config/.env'],
      load: [configuration],
      isGlobal: true,
    }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls, req) => {
          cls.set('userId', req.headers['x-user-id'])
        },
      },
    }),
    DataModule,
    ScheduleModule.forRoot(),
    UserModule,
    ChartsModule,
    JikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
