import { ItemModelData } from '@data/models/item-model'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('item')
export class EntityItem implements ItemModelData {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  image: string

  @Column()
  activeColor: string

  @Column()
  color: string

  @Column({
    unique: true
  })
  title: string
}
