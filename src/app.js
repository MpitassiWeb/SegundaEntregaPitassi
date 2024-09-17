import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import * as fs from "fs";

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

let products = [];

if (fs.existsSync("products.json")) {
  products = JSON.parse(fs.readFileSync("products.json", "utf-8"));
}

const httpServer = app.listen(8080, () => {
  console.log("Server ON");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo usuario conectado", socket.id);
  socketServer.sockets.emit("productsRealTimes", { products });
});

export default socketServer;
