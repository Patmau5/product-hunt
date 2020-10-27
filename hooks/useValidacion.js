import React, {useState, useEffect} from 'react';
import {error} from "next/dist/build/output/log";

const useValidacion = (stateInicial, validar, fn) => {

    const [valores, setValores] = useState(stateInicial)
    const [errores, setErrores] = useState({})
    const [submitForm, setSubmitForm] = useState(false)

    useEffect(() => {
        if (submitForm) {
            const noErrores = Object.keys(errores).length === 0;

            if (noErrores) {
                fn();
            }
            setSubmitForm(false);
        }
    }, [errores])

    const handleChange = e => {
        setValores({
            ...valores,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores)
        setErrores(erroresValidacion)
        setSubmitForm(true);
    }

    // Cuando el usuario sale del input
    const handleBlur = () => {
        const erroresValidacion = validar(valores)
        setErrores(erroresValidacion)
    }

    return {
        valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur
    }
};

export default useValidacion;
