import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import CustomersAPI from '../services/customersAPI';
import { toast } from "react-toastify";

const CustomerPage = ({history, match}) => {

    const {id = "new"} = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email:"",
        company:""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email:"",
        company:""
    });

    const [editing, setEditing] = useState(false);

    // Récupération du client en fonction de l'identifiant
    const fetchCustomer = async (id) => {
        try{
            const {lastName, firstName, email, company} = await CustomersAPI.find(id); 
            setCustomer({firstName, lastName, company, email});
        } catch(error) {
            toast.error("Erreur lors du chargement du client ❌");
        }
    };

    // Chargement du customer si un identifiant (valide) est passé dans l'url  à chaque changement d'identifiant
    useEffect(() => {
        if(id !== 'new'){
            setEditing(true);
            fetchCustomer(id)
        } 
    }, [id]);


    // Gestion des changements des input dans le formulaire
    const handleChange = ({currentTarget}) => {
        const{name, value} = currentTarget;
        
        setCustomer({...customer, [name]:value});
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            if(editing){
                await CustomersAPI.update(id, customer);
                toast.success("Le client a bien été modifié ✅");
            } else {
                await CustomersAPI.create(customer);
                toast.success("Le client a bien été crée ✅");
                history.replace("/customers");
            }          
            setErrors({});
        } catch(error) {
            console.log(error)
            const {violations} = error.response.data;
            if (violations){
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });

                setErrors(apiErrors);
                toast.error("Des erreurs dans le formulaire ❌");
            }
        }
    }

    return (  
        <>
            {!editing && <h1>Création d'un client</h1> || <h1>Modification du client numéro {id}</h1>} 

            <form onSubmit={handleSubmit}>
                <Field 
                    name="lastName" 
                    label="Nom de famille" 
                    placeholder="Nom de famille du client" 
                    value={customer.lastName} 
                    onChange={handleChange} 
                    error={errors.lastName}
                />
                <Field 
                    name="firstName" 
                    label="Prénom" 
                    placeholder="Prénom du client" 
                    value={customer.firstName} 
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field 
                    name="email" 
                    label="Email" 
                    placeholder="Adresse email du client"
                    type="email" 
                    value={customer.email} 
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field 
                    name="company" 
                    label="Entreprise" 
                    placeholder="Entreprise du client" 
                    value={customer.company} 
                    onChange={handleChange}
                    error={errors.company}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    );
}
 
export default CustomerPage;