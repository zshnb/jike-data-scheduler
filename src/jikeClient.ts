import { Injectable } from '@nestjs/common'

export type ApiToken = {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class JikeClient {
  host: string = 'https://api.ruguoapp.com/1.0'

  async getProfile({ accessToken, refreshToken }: ApiToken) {
    const response = await fetch(`${this.host}/users/profile`, {
      method: 'get',
      headers: {
        authority: 'api.ruguoapp.com',
        'app-version': '7.27.0',
        'x-jike-access-token': accessToken,
        'x-jike-refresh-token': refreshToken,
      },
    })
    if (response.ok) {
      return response.json()
    } else {
      const text = await response.text()
      throw new Error('get jike profile error' + text)
    }
  }
}
