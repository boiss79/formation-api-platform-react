import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import UsersAPI from '../services/usersAPI';

const Register = ({history}) => {
    
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })
    
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })

    // Gestion des changements des input dans le formulaire
    const handleChange = ({currentTarget}) => {
        const{name, value} = currentTarget;
        
        setUser({...user, [name]:value})
    }

    // Gestion de la soumission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const apiErrors = {};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Le mot de passe n'est pas identique à celui renseigné plus haut."
            setErrors(apiErrors);

            return
        }

        try{
            const data = await UsersAPI.createUser(user);
            
            setErrors({})
            history.replace("/login");
        } catch(error){
            const {violations} = error.response.data;

            if(violations){
                violations.forEach(violation => apiErrors[violation.propertyPath] = violation.message)
            }

            setErrors(apiErrors);
        }
    }
    
    return ( 
        <>
            <h1>Page d'inscription</h1>

            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre jolie prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field 
                    name="lastName"
                    label="Nom"
                    placeholder="Votre jolie nom"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field 
                    name="email"
                    type="email"
                    label="Adresse email"
                    placeholder="Votre adresse email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field 
                    name="password"
                    type="password"
                    label="Mot de passe"
                    placeholder="Choisissez un mot de passe très solide"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field 
                    name="passwordConfirm"
                    type="password"
                    label="Confirmation du mot de passe"
                    placeholder="Confirmer le mot de passe choisi"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>
        </>
     );
}
 
export default Register;