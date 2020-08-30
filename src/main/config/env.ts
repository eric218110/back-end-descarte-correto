const port = 1995

export default {
  MONGO_DB_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/node-api',
  PORT: Number(process.env.PORT) || port,
  SALT: 12,
  JWT_SECRET: process.env.JWT_SECRET || '59C457DE12F08B1F9D55333B26AE458C8F850122C3EC21730F496804368E435844F2AD645AD9F4D1A2B312DB6A3AEBC207A78E759F9CE024F54255D00F7F4270',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'AKIA3S6DZKR6LLEGC5EC',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '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',
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  AWS_BUCKET: process.env.AWS_BUCKET || 'tem-coleta-back-end-test',
  AWS_ACL: process.env.AWS_ACL || 'public-read',
  MODE: process.env.MODE || 'development',
  HOST_STATIC_PATH: process.env.HOST_STATIC_PATH || `http://localhost:${port}/files/`
}
