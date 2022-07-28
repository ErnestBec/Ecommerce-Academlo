const { app } = require("./app");
//Utils
const { db } = require("./utils/database");

const { initModels } = require("./models/initModels");

//Init db
db.authenticate()
  .then(() => {
    console.log("db authenticate Success!!");
  })
  .catch((err) => {
    console.log(err);
  });

//Init Models
initModels();

db.sync({ force: false })
  .then(() => {
    console.log("sync db success!!");
  })
  .catch((err) => {
    console.log(err);
  });
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("App run port !!", PORT);
});
