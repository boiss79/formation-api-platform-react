import React, {useState, useContext} from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';


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
                <div className="form-group">
                    <label htmlFor="username">Adresse Email</label>
                    <input 
                        type="email" 
                        placeholder="Adresse email de connexion" 
                        name="username" 
                        id="username" 
                        className="form-control"
                        value={credentials.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        name="password" 
                        id="password" 
                        className="form-control"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Connexion</button>
                </div>
            </form>
        </>
     );
}
 
export default LoginPage;