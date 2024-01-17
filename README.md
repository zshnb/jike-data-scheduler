# 介绍

这是一个Node.js的程序，用于定时抓取数据库中记录的即刻用户的粉丝数据，并提供生成图表和同步数据到Notion的接口

# 安装

1. 克隆仓库到本地
2. 执行`npm install`
3. 本地安装MySQL数据库，新建jike-data-scheduler的数据库
4. 修改config/.env里的DATABASE_URL信息，修改用户名和密码即可
5. 执行`npm run prisma:dev`
6. 执行`npm run start:dev`