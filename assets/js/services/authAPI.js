import axios from 'axios';
import CustomersAPI from './customersAPI';
import JwtDecode from 'jwt-decode';

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function authenticate (credentials) {

    return axios
        .post("http://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            //Stockage du token dans le localStorage
            window.localStorage.setItem('authToken', token);
        
            //On prévient Axios qu'on a maintent un token a rajouter dans le header de nos futures requêtes
            setAxiosToken(token);
        })
}

function setup() {
    // 1.Voir si un token est stockée
    const token = window.localStorage.getItem("authToken")

    // 2.Vérifier que le token est bien valide    
    if(token){
        const { exp : expiration } = JwtDecode(token);
        if(expiration * 1000 > new Date().getTime()){
            setAxiosToken(token);
        }
    }
}

function isAuthenticated(){
    // 1.Voir si un token est stockée
    const token = window.localStorage.getItem("authToken")

    // 2.Vérifier que le token est bien valide    
    if(token){
        const { exp : expiration } = JwtDecode(token);
        if(expiration * 1000 > new Date().getTime()){
            setAxiosToken(token);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}