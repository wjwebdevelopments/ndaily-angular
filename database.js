const mongoose = require('mongoose');

let uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jnklj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const database = cb => {

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
    .then(client => {
      const { name, user, host, port } = client.connections[0]
      console.log(`Database connected to mongodb+srv`);
      cb();
    })
    .catch(err => {
      console.log('Database connect failed')
    })

}

module.exports = database;
