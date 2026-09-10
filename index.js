import express from "express";
import bootstrap from "./src/app.controller.js";
import { PORT } from "./src/config/config.service.js";

const app = express()
const port = PORT

bootstrap(app, express)
app.listen(port, () => console.log(`app listening on port ${port}!`))