import { AccountModel } from './account'
import { ItemModel } from './item'

export type PointModel = {
  id: string
  placeName: string
  referencePoint: string
  locationType: string
  latitude: string
  longitude: string
  city: string
  state: string
  image: string
  items: ItemModel[]
  account: AccountModel
  neighborhood: string
  street: string
  zipCode: string
}
