import { DbAuthentication } from '@data/usecases/account/authentication/db-authentication'
import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'
import { BCryptAdapter } from '@infra/criptography/brcypt-adapter/brcypt-adapter'
import { JwtAdapter } from '@infra/criptography/jwt-adapter/jwt-adapter'
import env from '@main/config/env'
import { Authentication } from '@domain/usecases/account/authentication'

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()
  const bcrypterAdapter = new BCryptAdapter(env.SALT)
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET)
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcrypterAdapter,
    jwtAdapter,
    accountMongoRepository
  )
  return dbAuthentication
}
