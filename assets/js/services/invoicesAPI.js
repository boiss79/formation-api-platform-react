import axios from "axios";

function findAll(){
    return axios
    .get("http://127.0.0.1:8000/api/invoices")
    .then(response => (response.data['hydra:member']))
}

function remove(id){
    return axios
    .delete("http://127.0.0.1:8000/api/invoices/" + id)
}

export default {
    findAll,
    remove
}