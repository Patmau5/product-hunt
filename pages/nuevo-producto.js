import React, {useState, useContext, useEffect} from 'react';
import Layout from "../components/layout/Layout";
import Router, {useRouter} from 'next/router'
import {css} from '@emotion/core'
import FileUploader from "react-firebase-file-uploader";
import {Formulario, Campo, InputSubmit, Error} from "../components/ui/Formulario";

import {FirebaseContext} from "../firebase";

import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";

const STATE_INCIAL = {
    nombre: '',
    empresa: '',
    imagen: '',
    url: '',
    descripcion: ''
}
const NuevoProducto = () => {

    // state de las imagenes
    const [nombreimagen, setNombre] = useState('')
    const [subiendo, setSubiendo] = useState(false)
    const [progreso, setProgreso] = useState(0)
    const [urlimagen, setUrlimagen] = useState('')

    const [error, setError] = useState(false)

    const {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    } = useValidacion(STATE_INCIAL, validarCrearProducto, crearProducto)

    const {nombre, empresa, imagen, url, descripcion} = valores;

    const router = useRouter();
    const { usuario, firebase } = useContext(FirebaseContext)

    async function crearProducto() {
        if(!usuario) {
            return router.push('/login')
        }

        const producto = {
            nombre,
            empresa,
            url,
            urlimagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        }

        firebase.db.collection('productos').add(producto)

        return router.push('/')
    }

    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true)
    }

    const handleProgress = progreso => setProgreso({progreso})

    const handleUploadError = error => {
        setSubiendo(error)
        console.error(error)
    }

    const handleUploadSuccess = nombre => {
        setProgreso(100);
        setSubiendo(false)
        setNombre(nombre)
        firebase
            .storage
            .ref("productos")
            .child(nombre)
            .getDownloadURL()
            .then(url => {
                console.log(url)
                setUrlimagen(url)
            })
    }


    useEffect(() => {
        if(!usuario) {
            return router.push('/login')
        }
    },[])


    return (
        <div>
            <Layout>
                <h1
                    css={css`
                      text-align: center;
                      margin-top: 5rem;
                    `}
                >Nuevo producto</h1>
                <Formulario onSubmit={handleSubmit} noValidate>
                    <fieldset>
                        <legend>Información general</legend>
                        <Campo>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder="Nombre del producto"
                                value={nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.nombre && <Error>{errores.nombre}</Error>}
                        <Campo>
                            <label htmlFor="empresa">Empresa</label>
                            <input
                                type="text"
                                id="empresa"
                                name="empresa"
                                placeholder="Tu empresa o compañía"
                                value={empresa}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.empresa && <Error>{errores.empresa}</Error>}
                        <Campo>
                            <label htmlFor="imagen">Imágen</label>
                            <FileUploader
                                accept="image/*"
                                type="file"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebase.storage.ref('productos')}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </Campo>
                        <Campo>
                            <label htmlFor="url">URL</label>
                            <input
                                type="url"
                                id="url"
                                name="url"
                                value={url}
                                placeholder="URL del producto"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.url && <Error>{errores.url}</Error>}
                    </fieldset>

                    <fieldset>
                        <legend>Sobre tu producto</legend>
                        <Campo>
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={descripcion}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.descripcion && <Error>{errores.descripcion}</Error>}
                    </fieldset>
                    {error && <Error>{error}</Error>}
                    <InputSubmit type="submit" value="Crear producto"/>
                </Formulario>

            </Layout>
        </div>
    );
};

export default NuevoProducto;
