export interface User {
  name: string
  email: string
  imageUrl: string | null
  authorized: boolean
}

export interface Video {
  id: string
  label: string
  slug: string
  url: string
  year: string
  image: Queries.ImageSharpEdge
}
