export default {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: Number(process.env.PORT) || 1995,
  salt: 12,
  jwt_secret: '59C457DE12F08B1F9D55333B26AE458C8F850122C3EC21730F496804368E435844F2AD645AD9F4D1A2B312DB6A3AEBC207A78E759F9CE024F54255D00F7F4270'
}
