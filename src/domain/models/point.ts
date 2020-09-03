import { AccountModel } from './account'
import { ItemModel } from './item'

export type PointModel = {
  id: string
  name: string
  latitude: string
  longitude: string
  city: string
  state: string
  image: string
  phone: string
  items: ItemModel[]
  account: AccountModel
}
