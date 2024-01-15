import { Controller, Post, Query } from '@nestjs/common'
import { getCookieValue } from '../util/cookieUtil'
import { UserService } from '../user/user.service'

@Controller('jike')
export class JikeController {
  constructor(private readonly userService: UserService) {}
  @Post('/sms-code')
  async triggerSmsCode(@Query('phone') phone: string) {
    try {
      const response = await fetch('https://web-api.okjike.com/api/graphql', {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'authority': 'web-api.okjike.com',
        },
        body: JSON.stringify({
          operationName: 'GetSmsCode',
          variables: { 'mobilePhoneNumber': `${phone}`, 'areaCode': '+86' },
          query:
            'mutation GetSmsCode($mobilePhoneNumber: String!, $areaCode: String!) {\n  getSmsCode(action: PHONE_MIX_LOGIN, mobilePhoneNumber: $mobilePhoneNumber, areaCode: $areaCode) {\n    action\n    __typename\n  }\n}\n',
        }),
      })
      if (response.ok) {
        return {
          success: true,
        }
      } else {
        return {
          success: false,
        }
      }
    } catch (e) {
      return {
        success: false,
      }
    }
  }

  @Post('/login')
  async triggerLogin(
    @Query('phone') phone: string,
    @Query('code') code: string,
  ) {
    try {
      const response = await fetch('https://web-api.okjike.com/api/graphql', {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'authority': 'web-api.okjike.com',
        },
        body: JSON.stringify({
          operationName: 'MixLoginWithPhone',
          variables: {
            'smsCode': `${code}`,
            'mobilePhoneNumber': `${phone}`,
            'areaCode': '+86',
          },
          query:
            'mutation MixLoginWithPhone($smsCode: String!, $mobilePhoneNumber: String!, $areaCode: String!) {\n  mixLoginWithPhone(smsCode: $smsCode, mobilePhoneNumber: $mobilePhoneNumber, areaCode: $areaCode) {\n    isRegister\n    user {\n      distinctId: id\n      ...TinyUserFragment\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment TinyUserFragment on UserInfo {\n  avatarImage {\n    thumbnailUrl\n    smallPicUrl\n    picUrl\n    __typename\n  }\n  isSponsor\n  username\n  screenName\n  briefIntro\n  __typename\n}\n',
        }),
      })

      const json = await response.json()
      if (json.errors) {
        return {
          success: false,
        }
      } else {
        const setCookie = response.headers.get('set-cookie')
        const jikeAccessToken = getCookieValue(setCookie, 'x-jike-access-token')
        const jikeRefreshToken = getCookieValue(
          setCookie,
          'x-jike-refresh-token',
        )
        await this.userService.createUser({
          accessToken: jikeAccessToken,
          refreshToken: jikeRefreshToken,
        })
        return {
          success: true,
        }
      }
    } catch (e) {
      return {
        success: false,
      }
    }
  }
}
