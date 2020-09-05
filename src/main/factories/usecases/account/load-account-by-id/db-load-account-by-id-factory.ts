import { LoadAccountById } from '@domain/usecases/account/load-account-by-id'
import { DbLoadAccountById } from '@data/usecases/account/load-account-by-id/db-load-account-by-id'
import { AccountTypeOrmRepository } from '@infra/db/typeorm/repositories/account/account-typeorm-repository'

export const makeDbLoadAccountById = (): LoadAccountById => {
  const loadAccountByIdRepository = new AccountTypeOrmRepository()
  return new DbLoadAccountById(loadAccountByIdRepository)
}
