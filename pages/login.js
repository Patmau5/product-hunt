import React, {useState} from 'react';
import Layout from "../components/layout/Layout";
import Router from 'next/router'
import { css } from '@emotion/core'
import { Formulario, Campo, InputSubmit, Error } from "../components/ui/Formulario";

import firebase from "../firebase";

import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSesion";

const STATE_INCIAL = {
    email: '',
    password: '',
}

const Login = () => {

    const [error, setError] = useState(false)

    const {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    } = useValidacion(STATE_INCIAL,validarIniciarSesion, inciarSesion)

    const { email, password } = valores;

    async function inciarSesion() {
        try {
            await firebase.login(email, password);
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
                >Iniciar sesión</h1>
                <Formulario onSubmit={handleSubmit} noValidate>
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
                    <InputSubmit type="submit" value="Iniciar sesión"/>
                </Formulario>

            </Layout>
        </div>
    );
};

export default Login;
