import { DbAuthentication } from '@data/usecases/account/authentication/db-authentication'
import { AccountTypeOrmRepository } from '@infra/db/typeorm/repositories/account/account-typeorm-repository'
import { BCryptAdapter } from '@infra/criptography/brcypt-adapter/brcypt-adapter'
import { JwtAdapter } from '@infra/criptography/jwt-adapter/jwt-adapter'
import env from '@main/config/env'
import { Authentication } from '@domain/usecases/account/authentication'

export const makeDbAuthentication = (): Authentication => {
  const accountTypOrmRepository = new AccountTypeOrmRepository()
  const bcrypterAdapter = new BCryptAdapter(env.SALT)
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET)
  const dbAuthentication = new DbAuthentication(
    accountTypOrmRepository,
    bcrypterAdapter,
    jwtAdapter,
    accountTypOrmRepository
  )
  return dbAuthentication
}
