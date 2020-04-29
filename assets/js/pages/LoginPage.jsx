import React, {useState, useContext} from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';


const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    })
    const [errorLogin, setErrorLogin] = useState("d-none")

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;

        setCredentials({...credentials, [name]:value })
    }

    // Gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            await AuthAPI.authenticate(credentials);
            setErrorLogin("d-none");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch(error) {
            setErrorLogin("");
            console.log("erreur")
        }
    }
    
    return ( 
        <>
            <h1>Connexion à l'application</h1>

            <p className={`my-3 text-danger ${errorLogin}`}>Les informations de connexion sont invalides !</p>
            <form onSubmit={handleSubmit} >
                <Field 
                    name="username" 
                    label="Adresse Email" 
                    value={credentials.username} 
                    onChange={handleChange} 
                    placeholder="Adresse email de connexion" 
                    type="email" 
                />
                
                <Field 
                    name="password" 
                    label="Mot de passe" 
                    value={credentials.password} 
                    onChange={handleChange} 
                    type="password" 
                />
                
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Connexion</button>
                </div>
            </form>
        </>
     );
}
 
export default LoginPage;