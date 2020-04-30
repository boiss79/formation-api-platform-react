import React, {useEffect, useState} from 'react';
import Pagination from '../components/Pagination';

import InvoicesAPI from "../services/invoicesAPI"
import moment from 'moment';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import TableLoader from '../components/loaders/TableLoader';

const STATUS_CLASSES = {
    PAID: 'success',
    SENT: 'primary',
    CANCELLED: 'danger'
}

const STATUS_LABELS = {
    PAID: 'Payée',
    SENT: 'Envoyée',
    CANCELLED: 'Annulée'
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 10;
    
    //Gestion de la récupération des invoices
    const fetchInvoices = async () => {

        try{
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch(error) {
            console.log(error.response);
            toast.error("Erreur lors du chargement des factures ❌");
        }
    }

    //Charger les invoices au chargement du composent
    useEffect(() =>{
        fetchInvoices()
    }, []);

    // Gestion du format de date des invoices
    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    // Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    // Gestion de la suppression des factures
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try{
            await InvoicesAPI.remove(id)
            toast.success("La facture a bien été supprimée ✅");
            
        } catch(error) {
            console.log(error.response);
            setInvoices(originalInvoices);
            toast.error("Une erreur est survenue ❌");
        }
    }

    // Filtrage des invoices selon la recherche
    const filteredInvoices = invoices.filter(
        i => 
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    )

    // Pagination des données
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    return ( 
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link className="btn btn-primary" to="/invoice/new">Créer une facture</Link>
            </div>

            <div className="form-group">
                <input
                    onChange={handleSearch}
                    value={search}
                    className="form-control"
                    placeholder="Rechercher ..."
                    type="text"
                />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoie</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>

                {!loading && <tbody>
                    {paginatedInvoices.map(invoice => 
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td>
                                <Link to={"/customer/"+invoice.customer.id} className="text-white">
                                        <span className="badge badge-primary">{invoice.customer.firstName} {invoice.customer.lastName}</span>
                                </Link>
                            </td> 
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className={"text-center text-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</td>
                            <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                            <td>
                                <Link className="btn btn-sm btn-primary mr-2" to={"/invoice/" + invoice.id}>Editer</Link>
                                <button className="btn btn-sm btn-danger mx-1" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                            </td>
                        </tr>                        
                    )}
                </tbody>
                }
            </table>
            {loading && <TableLoader />}

            <Pagination
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                onPageChanged={handlePageChange} 
                length={filteredInvoices.length} />
        </>
     );
}
 
export default InvoicesPage;