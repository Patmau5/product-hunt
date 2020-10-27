import React, {useState} from 'react';
import Layout from "../components/layout/Layout";
import Router from 'next/router'
import { css } from '@emotion/core'
import { Formulario, Campo, InputSubmit, Error } from "../components/ui/Formulario";

import firebase from "../firebase";

import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";

const STATE_INCIAL = {
    nombre: '',
    email: '',
    password: '',
}

const CrearCuenta = () => {

    const [error, setError] = useState(false)

    const {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    } = useValidacion(STATE_INCIAL,validarCrearCuenta, crearCuenta)

    const { nombre, email, password } = valores;

    async function crearCuenta() {
        try {
            await firebase.registrar(nombre, email, password)
            Router.push('/')
        } catch (error) {
            console.error('Hubo un error al crear el usuario', error.message)
             setError(error.message)
        }
    }

    return (
        <div>
            <Layout>
                <h1
                    css={css`
                      text-align: center;
                      margin-top: 5rem;
                    `}
                >Crear cuenta</h1>
                <Formulario onSubmit={handleSubmit} noValidate>
                    <Campo>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.nombre && <Error>{errores.nombre}</Error>}
                    <Campo>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Tu email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.email && <Error>{errores.email}</Error>}
                    <Campo>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Tu password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.password && <Error>{errores.password}</Error>}
                    {error && <Error>{error}</Error>}
                    <InputSubmit type="submit" value="Crear cuenta"/>
                </Formulario>

            </Layout>
        </div>
    );
};

export default CrearCuenta;
