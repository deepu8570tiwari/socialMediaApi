const express= require("express");
const routes=express.Router();
routes.get('/', routes);
module.exports=routes;