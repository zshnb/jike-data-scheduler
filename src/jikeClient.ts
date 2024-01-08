import { Injectable } from '@nestjs/common'

export type ApiToken = {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class JikeClient {
  host: string = 'https://api.ruguoapp.com/1.0'

  async getProfile({ accessToken, refreshToken }: ApiToken) {
    const response = await this.doGetProfile({ accessToken, refreshToken })
    if (response.success === false) {
      const refreshTokenResponse = await this.refreshToken(refreshToken)
      const newAccessToken = refreshTokenResponse['x-jike-access-token']
      const newRefreshToken = refreshTokenResponse['x-jike-refresh-token']
      const profile = await this.doGetProfile({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
      return {
        ...profile,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    } else {
      return response
    }
  }

  async doGetProfile({ accessToken, refreshToken }: ApiToken) {
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
      console.error(`get profile error: ${text}`)
      return {
        success: false,
      }
    }
  }

  async refreshToken(refreshToken: string) {
    const response = await fetch(`${this.host}/app_auth_tokens.refresh`, {
      method: 'get',
      headers: {
        'x-jike-refresh-token': refreshToken,
      },
    })
    if (response.ok) {
      return response.json()
    } else {
      const text = await response.text()
      throw new Error(`refresh token error: ${text}`)
    }
  }
}
