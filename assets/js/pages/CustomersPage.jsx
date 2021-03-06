import React, {useEffect, useState} from 'react';
import Pagination from '../components/Pagination';

import CustomersAPI from "../services/customersAPI"
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import TableLoader from '../components/loaders/TableLoader';

const CustomersPage = props => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 10;

    // Permet d'aller récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors du chargement des clients ❌");
        }
    }

    // Au chargement du composent on va chercher les customers
    useEffect(() => {fetchCustomers()}, []);

    // Gestion de la supression d'un client
    const handleDelete = async id => {
        const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id));

        try{
            await CustomersAPI.remove(id);
            toast.success("Le client a bien été supprimé  ✅");
        } catch (error) {
            setCustomers(originalCustomers);
            toast.success("Le client n'a pas été supprimé  ❌");
        }
    };

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);
    
    // Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    // Filtrage des customers selon la recherche
    const filteredCustomers = customers.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.includes(search))
    );

    // Pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return ( 
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customer/new" className="btn btn-primary">Création d'un nouveau client</Link>
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

            <table className="table table-hover mt-5">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                {!loading && <tbody>
                    {paginatedCustomers.map(customer =>                     
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td> 
                            <Link to={"/customer/"+customer.id} className="text-white">
                                    <span className="badge badge-primary">{customer.firstName} {customer.lastName}</span>
                                </Link> 
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">{customer.invoices.length}</td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()} &euro;</td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0} 
                                    className="btn btn-sm btn-danger">
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    )}

                </tbody>
                }
            </table>
            {loading && <TableLoader />}
            
            {filteredCustomers.length > itemsPerPage && (
                <Pagination 
                    currentPage={currentPage} 
                    itemsPerPage={itemsPerPage} 
                    length={filteredCustomers.length} 
                    onPageChanged={handlePageChange} 
                />
            )}
        </>
     );
}
 
export default CustomersPage;