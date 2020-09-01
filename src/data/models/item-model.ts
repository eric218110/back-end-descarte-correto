import { ItemModel } from '@domain/models/item'

export type ItemModelData = ItemModel
export type AddItemModelData = Omit<ItemModel, 'id'>
export type LoadItemModelData = Omit<ItemModel, 'id'>
