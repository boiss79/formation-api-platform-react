import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/Select';
import { Link } from 'react-router-dom';
import CustomersAPI from '../services/customersAPI';
import InvoicesAPI from '../services/invoicesAPI';
import { toast } from "react-toastify";

const InvoicePage = ({history, match}) => {

    const {id="new"} = match.params;

    const [editing, setEditing] = useState(false);
    
    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status:"SENT"
    });

    const [customers, setCustomers] = useState([])
    
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status:""
    });

    const fetchCustomers = async () => {
        
        try{    
            const data = await CustomersAPI.findAll();
            setCustomers(data)

            if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch(error) {

            toast.error("Erreur lors du chargement des clients ❌");
            history.replace("/invoices");
        }
    }

    const fetchInvoice = async id => {
        try{
            const {amount, status, customer} = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
        } catch(error){

            toast.error("Erreur lors du chargement de la facture ❌");
            history.replace("/invoices");
        }
    }

    // Récupération des clients quand la âge change
    useEffect(() => {
        fetchCustomers();
    }, [])

    // Récupération de la bonne facture quand l'id change
    useEffect(() => {
        if(id !== "new"){
            fetchInvoice(id);
            setEditing(true);
        }
    }, [id])

    // Gestion des changements des input dans le formulaire
    const handleChange = ({currentTarget}) => {
        const{name, value} = currentTarget;
        
        setInvoice({...invoice, [name]:value})
    }

    // gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault()
        
        try{
            if(editing){
                await InvoicesAPI.update(id, invoice);  
                toast.success("La facture a bien été modifiée ✅");        
            } else{
                const data = await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été crée ✅");
            }
            history.replace("/invoices");
        } catch ({response}) {
            const {violations} = response.data;
            if (violations){
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                })

                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire ❌");
            }
        }
    }

    return ( 
        <>
            {editing && <h1>Modification de la facture n°{id}</h1> || <h1>Création d'une facture</h1>}

            <form onSubmit={handleSubmit}>
                <Field 
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />
                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer => 
                        <option 
                            value={customer.id} 
                            key={customer.id}>
                                {customer.firstName}{customer.lastName}
                        </option>
                    )}
                </Select>
                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="PAID">Payée</option>
                    <option value="SENT">Envoyée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                    <Link to="/invoices" className="ml-3">Retour aux factures</Link>
                </div>

            </form>
        </>
     );
}
 
export default InvoicePage;