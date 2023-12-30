const moveToProductos = () => {
    window.location.href = '/productos'
}

const moveToProductPage = (idProducto) => {
    window.location.href = '/producto/' + idProducto;
}

const moveToValorarPage = (idProducto, usuarioValorador, usuarioValorado) => {
    window.location.href = '/valorar/' + idProducto + '/' + usuarioValorador + '/' + usuarioValorado;
}

const moveToMainPage = () => {
    window.location.href = '/';
}

const moveToUpdateProductPage = (idProducto) => {
    window.location.href = '/updateProducto/' + idProducto;
}


const routerService = {moveToProductos, moveToProductPage, moveToValorarPage, moveToMainPage, moveToUpdateProductPage}

export default routerService;