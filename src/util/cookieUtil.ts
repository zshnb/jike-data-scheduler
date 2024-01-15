export function getCookieValue(cookieStr: string, name: string) {
  const cookies = cookieStr.split(/, (?=[^;]+?=[^;]+;)/)
  for (const cookie of cookies) {
    const parts = cookie.split(';')[0].split('=')
    if (parts[0].trim() === name) {
      return parts[1].trim()
    }
  }
  return ''
}
