import Axios from 'axios';

import usuarioService from "./usuarioService.js";

const getProductos = async (setProductos) => {
    await Axios.get("http://127.0.0.1:5001/api/v2/productos", {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    }).then((res) => {
        setProductos(res.data.productos)
    }).catch((error) => {
        usuarioService.logOut()
    });
}

const filtrarProductos = async (setProductos, usuario, texto, orden) => {
    let res = await Axios.post("http://127.0.0.1:5001/api/v2/productos/filter", {
        usuario: usuario,
        texto: texto,
        orden: orden
    }, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    }).then((res) => {
        setProductos(res.data.productos)
    }).catch((error) => {
        usuarioService.logOut()
    });

}

const getProductoById = async (setProducto, idProducto) => {
    await Axios.get("http://127.0.0.1:5001/api/v2/productos/" + idProducto,
        {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        .then((res) => {
            setProducto(res.data.producto)
        }).catch((error) => {
            usuarioService.logOut()
        })
}

const getProductosByUsuario = async (setProductos, usuario) => {
    await Axios.get("http://127.0.0.1:5001/api/v2/productos?usuario=" + usuario,
        {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        .then((res) => {
            setProductos(res.data.productos)
        }).catch((error) => {
            usuarioService.logOut()
        })
}


const addProduct = async (productoFormData) => {
    try {
        const response = await Axios.post("http://127.0.0.1:5001/api/v2/productos/", productoFormData,
            {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            }).catch((error) => {
            usuarioService.logOut()
        });
        return {status: response.data.status};
    } catch (error) {
        return {status: error.response.status, mensaje: error.response.data.message};
    }
};

const updateProduct = async (productoFormaData) => {
    try {
        const response = await Axios.put("http://127.0.0.1:5001/api/v2/productos/", productoFormaData,
            {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            }).catch((error) => {
            usuarioService.logOut()
        });
        return {status: response.data.status};
    } catch (error) {
        return {status: error.response.status, mensaje: error.response.data.message};
    }
};


const deleteProduct = async (producto, user) => {
    try {
        const response = await Axios.delete('http://127.0.0.1:5001/api/v2/productos/' + producto,
            {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            }).catch((error) => {
            usuarioService.logOut()
        });
        const appId = process.env.REACT_APP_ID;
        const apiKey = process.env.REACT_APP_APIKEY;

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.talkjs.com/v1/' + appId + '/users/' + user + '/conversations',
            headers: {
                'Authorization': 'Bearer ' + apiKey
            }
        };

        const resConv = await Axios.request(config);
        if (Array.isArray(resConv.data.data)) {
            const deletePromises = resConv.data.data.map(async (chat) => {
                let idProd = chat.id.split("_")[0];
                let vend = chat.id.split("_")[1];
                let comp = chat.id.split("_")[2];
                if (idProd === producto) {
                    let config = {
                        method: 'delete',
                        maxBodyLength: Infinity,
                        url: 'https://api.talkjs.com/v1/' + appId + '/conversations/' + chat.id + '/participants/' + vend,
                        headers: {
                            'Authorization': 'Bearer ' + apiKey,
                        }
                    };
                    await Axios.request(config);
                    config = {
                        method: 'delete',
                        maxBodyLength: Infinity,
                        url: 'https://api.talkjs.com/v1/' + appId + '/conversations/' + chat.id + '/participants/' + comp,
                        headers: {
                            'Authorization': 'Bearer ' + apiKey,
                        }
                    };
                    return Axios.request(config);
                }
            });

            await Promise.all(deletePromises);
        } else {
            throw new Error("Expected an array of conversations");
        }

    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
};


const getCoordenadasByCodPostal = async (producto, setCoordenadas) => {
    try {
        if (producto.direccion && producto.direccion !== 29080) {
            await Axios.get('http://127.0.0.1:5004/api/v2/carbono/coord?codPostal=' + producto.direccion,
                {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).then((res) => {
                res.data.title = producto.nombre
                setCoordenadas(res.data)
            }).catch((error) => {
                usuarioService.logOut()
            });
        }
    } catch (error) {
        console.error(error);
    }
}

const pujar = async (usuario, cantidad, producto) => {
    try {
        await Axios.post('http://127.0.0.1:5002/api/v2/pujas/', {
                usuario: usuario,
                cantidad: cantidad,
                producto: producto
            },
            {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            }).then((res) => {
            return {status: res.status, mensaje: res.data.mensaje}
        }).catch((error) => {
            usuarioService.logOut()
        });
    } catch (error) {
        return {status: error.response.status, mensaje: error.response.data}
    }
}

const getCoordenadasListByCodPostal = async (productos, setCoordenadas) => {
    try {
        let coordenadas = [];

        for (const producto of productos) {
            if (producto.direccion && producto.direccion !== 29080) {
                const response = await Axios.get('http://127.0.0.1:5004/api/v2/carbono/coord?codPostal=' + producto.direccion, {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                }).catch((error) => {
                    usuarioService.logOut()
                });
                response.data.title = producto.nombre
                coordenadas.push(response.data);
            }

        }
        setCoordenadas(coordenadas);
    } catch (error) {
        console.error(error);
    }
}

const calcularHuellaCarbono = async (coordenadasUsuario, codPostalProducto, setCarbono) => {
    try {
        await Axios.get('http://127.0.0.1:5004/api/v2/carbono/huella?userLat=' + coordenadasUsuario.latitude + '&userLong='
            + coordenadasUsuario.longitude + '&codPostalProducto=' + codPostalProducto, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then((res) => {
            setCarbono(res.data.carbonEquivalent)
        }).catch((error) => {
            usuarioService.logOut()
        });
    } catch (error) {
        console.error(error);
    }
}

const productoService = {
    getProductos,
    filtrarProductos,
    getProductosByUsuario,
    getProductoById,
    addProduct,
    deleteProduct,
    getCoordenadasByCodPostal,
    getCoordenadasListByCodPostal,
    pujar,
    calcularHuellaCarbono,
    updateProduct
}

export default productoService;