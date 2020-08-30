type Image = {
  title: string
  image: string
}

type User = {
  email: string
  name: string
}

export type PointModel = {
  id: string
  name: string
  latitude: string
  longitude: string
  city: string
  state: string
  image: string
  phone: string
  items: Image[]
  user: User
}
