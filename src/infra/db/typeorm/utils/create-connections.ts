import { Connection, createConnection, getConnection } from 'typeorm'

export const connectionDatabase = {
  create: async (): Promise<Connection> => {
    const connection = await createConnection()
    if (process.env.MODE === 'test') {
      await connection.dropDatabase()
      await connection.synchronize()
      await connection.runMigrations()
    }
    return connection
  },

  async close(): Promise<void> {
    await getConnection().close()
  },

  async clear(): Promise<void> {
    const connection = getConnection()
    const entities = connection.entityMetadatas

    await Promise.all(
      entities.map(async entity => {
        const repository = connection.getRepository(entity.name)
        await repository.query(`DELETE FROM ${entity.tableName}`)
      })
    )
  }
}
