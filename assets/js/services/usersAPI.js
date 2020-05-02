import Axios from 'axios';
import { USERS_API } from './config';

function createUser(user){
    return Axios.post(USERS_API, user);
}

export default{
    createUser
}