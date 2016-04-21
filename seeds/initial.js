
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('users').insert({ username: 'pbienias', email: 'pbienias@gmail.com' })
  );
};
