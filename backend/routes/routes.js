module.exports = app => {
  const users = require("../controllers/controller.js");

  var router = require("express").Router();

  // Create a new item
  router.post("/", users.create);

  // Retrieve all items
  router.get("/", users.findAll);

  //edit items
  router.post("/edit", users.edit);

  //delete item
  router.post("/delete", users.delete);

  app.use('/boards', router);
};