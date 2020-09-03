import { LoggerModelData } from '@data/models/logger-model'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm'

@Entity('logger')
export class EntityLogger implements LoggerModelData {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  stack: string

  @CreateDateColumn()
  date: Date
}
