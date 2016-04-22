
exports.up = function(knex, Promise) {

  return knex.schema.createTable('users', function(table){
    table.increments('id').primary();
    table.string('username');
    table.string('email');
    table.string('password');
  }).createTable('tokens', function(table) {
    table.uuid('id').primary();
    table.boolean('valid');
    table.integer('user_id').references('users.id').onDelete('CASCADE');
    table.string('token');
  })

};

exports.down = function(knex, Promise) {

  return knex.schema.dropTableIfExists('tokens').dropTableIfExists('users');

};
