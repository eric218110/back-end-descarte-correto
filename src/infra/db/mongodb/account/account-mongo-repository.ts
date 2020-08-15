import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/data/account/update-access-token-repository'
import { AddAccountRepository } from '@data/protocols/data/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/data/account/load-by-email-repository'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]
    return MongoHelper.collectionWithoutId<AccountModel>(account)
  }

  async loadWithEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('account')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.collectionWithoutId<AccountModel>(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken: token
      }
    })
  }
}
