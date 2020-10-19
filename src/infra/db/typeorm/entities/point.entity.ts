import { PointModelData } from '@data/models/point-model'
import { EntityAccount } from './account.entity'
import { EntityItem } from './item.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne
} from 'typeorm'

@Entity('point')
export class EntityPoint implements PointModelData {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  placeName: string

  @Column()
  referencePoint: string

  @Column()
  locationType: string

  @Column()
  image: string

  @Column()
  latitude: string

  @Column()
  longitude: string

  @Column()
  city: string

  @Column()
  state: string

  @Column()
  neighborhood: string

  @Column()
  street: string

  @Column()
  zipCode: string

  @ManyToMany(type => EntityItem)
  @JoinTable()
  items: EntityItem[]

  @ManyToOne(type => EntityAccount)
  account: EntityAccount
}
