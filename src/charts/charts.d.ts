export type GetFollowerChart = {
  username: string
  notionIntegrationKey?: string
  databaseId?: string
  pageId?: string
}

type ChartConfiguration = {
  type: 'line'
  data: object
  options: object
  plugins: []
}

export type GenerateQuickChart = {
  width: string // Pixel width
  height: string // Pixel height
  devicePixelRatio: number // Pixel ratio (2.0 by default)
  format: string // png, svg, or webp
  backgroundColor: string // Canvas background
  version: string // Chart.js version
  key: string // API key (optional)
  chart: ChartConfiguration // Chart.js configuration
}
