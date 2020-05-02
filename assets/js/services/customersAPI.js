import axios from "axios";
import Cache from "./cache";

async function findAll(){
    
    const cachedCustomers = await Cache.get("customers");

    if(cachedCustomers) return cachedCustomers;
    
    return axios
    .get("http://127.0.0.1:8000/api/customers")
    .then(response => {
        const customers = response.data['hydra:member'];
        Cache.set("customers", customers);

        return customers;
    })
}

function remove(id){
    
    return axios
        .delete("http://127.0.0.1:8000/api/customers/" + id)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");

            if(cachedCustomers){
                Cache.set("customers", cachedCustomers.filter(c => c.id !== id));
            }

            return response;
        });
}

async function find (id){

    const cachedCustomer = await Cache.get("customers".id);

    if(cachedCustomer) return cachedCustomer;

    return axios
    .get("http://127.0.0.1:8000/api/customers/" + id)
    .then(response => {
        const customer = response.data;

        Cache.set("customers".id, customer);

        return customer;
    })
}

function update(id, customer){
    return axios
        .put("http://127.0.0.1:8000/api/customers/" + id, customer)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");
            
            if(cachedCustomers){

                const cachedCustomer = cachedCustomers[id];

                if(cachedCustomer){
                    Cache.set("customers." + id, response.data);
                }
    
                const index = cachedCustomers.findIndex(c => c.id === +id);
                const newCachedCustomer = response.data;
                
                cachedCustomers[index] = newCachedCustomer;
            }

            return response;
        });
}

function create(customer){
    
    return axios
        .post("http://127.0.0.1:8000/api/customers", customer)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");

            if(cachedCustomers){
                Cache.set("customers", [...cachedCustomers, response.data]);
            }

            return response;
        });
}

export default {
    findAll,
    remove,
    find,
    update,
    create
}