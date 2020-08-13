import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { addpterRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', addpterRoute(makeSignUpController()))
}
