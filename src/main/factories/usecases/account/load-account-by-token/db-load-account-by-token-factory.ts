import { LoadAccountByToken } from '@domain/usecases/account/load-accout-by-token'
import { DbLoadAccountByToken } from '@data/usecases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@infra/criptography/jwt-adapter/jwt-adapter'
import env from '@main/config/env'
import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwt_secret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, loadAccountByTokenRepository)
}
