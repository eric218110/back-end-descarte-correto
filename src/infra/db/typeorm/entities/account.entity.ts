import { AccountModelData } from '@data/models/account-model'
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm'

@Entity('account')
export class EntityAccount implements AccountModelData {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({
    nullable: true
  })
  accessToken: string

  @Column({
    default: 'user'
  })
  role: string
}
