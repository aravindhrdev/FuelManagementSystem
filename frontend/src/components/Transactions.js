import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../Socket';

const FuelTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/fuel-stocks/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();

        if (socket) {
            socket.on('newTransaction', (transaction) => {
                setTransactions((prevTransactions) => [transaction, ...prevTransactions]);
            });
        }

        return () => {
            if (socket) {
                socket.off('newTransaction');
            }
        };
    }, [socket]);
    const styles = {
        olist:{
            display:"flex",
            flexDirection : "row",
            border:5,
            listStyleType : 'None',
            flexWrap: 'wrap',
        },
        ilist:{
            textAlign:"justify",
            padding: 40,
        }
    }
    return (
        <div>
            <h2>Recent Fuel Transactions</h2>
            <ul style={styles.olist}>
                {transactions.map(transaction => (
                    <li key={transaction.transaction_id} style = {styles.ilist}>
                        <strong>Transaction ID:</strong> {transaction.transaction_id} <br />
                        <strong>Fuel Type:</strong> {transaction.fuelType} <br />
                        <strong>Quantity Sold:</strong> {transaction.quantity} liters <br />
                        <strong>Branch ID:</strong> {transaction.branch_id} <br />
                        <strong>Payment Method:</strong> {transaction.payment_method} <br />
                        <strong>Total Amount:</strong> Rs.{transaction.total_amount} <br />
                        <strong>Employee ID:</strong> {transaction.employee_id} <br />
                        <strong>Pump ID:</strong> {transaction.pump_id} <br />
                        <strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleString('en-IN')}
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FuelTransactions;

