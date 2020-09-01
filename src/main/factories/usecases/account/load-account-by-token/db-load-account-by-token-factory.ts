import { LoadAccountByToken } from '@domain/usecases/account/load-accout-by-token'
import { DbLoadAccountByToken } from '@data/usecases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@infra/criptography/jwt-adapter/jwt-adapter'
import env from '@main/config/env'
import { AccountTypeOrmRepository } from '@infra/db/typeorm/repositories/account/account-typeorm-repository'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET)
  const loadAccountByTokenRepository = new AccountTypeOrmRepository()
  return new DbLoadAccountByToken(jwtAdapter, loadAccountByTokenRepository)
}
