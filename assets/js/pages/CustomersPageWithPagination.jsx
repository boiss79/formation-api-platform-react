import React, {useEffect, useState} from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = props => {

    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setTotalItems(response.data['hydra:totalItems']);
                setCustomers(response.data['hydra:member']);
                setLoading(false);
            })
            .catch(error => console.log(error.response))
    }, [currentPage]);

    const handleDelete = (id) => {
        console.log(id)

        const originalCustomers = [...customers];

        // 1. Approche optimiste en mettant à jour directement le State en se disant que la requête à marché
        setCustomers(customers.filter(customer => customer.id !== id));

        // 2. Approche pessimiste, si jamais la requête est pas passé, on remet à jour le State en utilisant la copie du tableau customers

        axios
            .delete("http://127.0.0.1:8000/api/customers/" + id)
            .then(response => console.log(id))
            .catch(error => {
                setCustomers(originalCustomers)
                console.log(error.response)
            })
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    }

    const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage);

    return ( 
        <>
            <h1>Liste des clients (pagination) </h1>

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
                <tbody>
                    {loading && 
                        <tr>
                            <td>Chargement ...</td>
                        </tr>
                    }
                    {!loading && customers.map(customer =>                     
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td> 
                                <a href="#" className="text-white">
                                    <span className="badge badge-primary">{customer.firstName} {customer.lastName}</span>
                                </a> 
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
            </table>
            
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChanged={handlePageChange} />
        </>
     );
}
 
export default CustomersPageWithPagination;