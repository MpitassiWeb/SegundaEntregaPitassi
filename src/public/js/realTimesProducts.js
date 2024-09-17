const socket = io();

socket.on("productsRealTimes", (data) => {
  let productList = document.getElementById("productList");
  let etiquetaProducto = [];
  data.products.forEach((element) => {
    etiquetaProducto += `
      <h3>Zapatillas: ${element.title}</h3>
      <p>${element.description}</p>
      <span>$ ${element.price}</span>`;
  });
  productList.innerHTML = etiquetaProducto;
});
