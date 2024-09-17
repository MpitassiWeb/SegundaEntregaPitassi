import { Router } from "express";
import * as fs from "fs";

const router = Router();
let carts = [];

if (fs.existsSync("carts.json")) {
  carts = JSON.parse(fs.readFileSync("carts.json", "utf-8"));
}

router.get("/", (req, res) => {
  res.send(carts);
});

router.get("/:cid", (req, res) => {
  const idCart = +req.params.cid;
  const cart = carts.find((cart) => cart.id === idCart);
  if (!cart) {
    res
      .status(404)
      .send({ status: "error", error: `Carrito ${idCart} no encontrado` });
  } else {
    res.send(cart.products);
  }
});

router.post("/", (req, res) => {
  const newCart = {
    id: carts.length + 1,
    products: [],
  };
  carts.push(newCart);
  fs.writeFileSync("carts.json", JSON.stringify(carts));
  res.send({
    status: "success",
    message: `Carrito creado con id ${carts.length}`,
  });
});

router.post("/:cid/product/:pid", (req, res) => {
  const idCart = +req.params.cid;
  const idProduct = +req.params.pid;

  const i = carts.findIndex((cart) => cart.id === idCart);

  if (i === -1) {
    return res
      .status(404)
      .send({ status: "error", error: `Carrito ${idCart} no encontrado` });
  }
  let newProduct = { id: idProduct, quantity: 1 };
  const existe = carts[i].products.findIndex(
    (product) => product.id === idProduct
  );
  if (existe === -1) {
    carts[i].products.push(newProduct);
  } else {
    carts[i].products[existe].quantity = carts[i].products[existe].quantity + 1;
  }
  fs.writeFileSync("carts.json", JSON.stringify(carts));
  res.send({
    status: "success",
    error: `Producto ${idProduct} agregado correctamente`,
  });
});

export default router;
