import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("username")
      table.string("text")

      table.integer('moment_id').unsigned().references('moments.id').onDelete('CASCADE') // Establece a relação entre as tabelas Comment e Moment e através do comando "onDelete('CASCADE')" quando um momento é apagado todos os coments serão deletados

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
