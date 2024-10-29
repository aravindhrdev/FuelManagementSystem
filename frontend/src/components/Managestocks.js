import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../Socket';

const ManageFuelStocks = () => {
    const [stocks, setStocks] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/fuel-stocks/branches');
                setStocks(response.data);
            } catch (error) {
                console.error('Error fetching fuel stocks:', error);
            }
        };

        const handleStockUpdate = (updatedStock) => {
            setStocks((prevStocks) => {
                return prevStocks.map((branch) => 
                    branch.branch_id === updatedStock.branch_id 
                        ? { ...branch, stock_levels: updatedStock.stock_levels } 
                        : branch
                );
            });
        };

        if (socket) { 
            console.log('Updatestock socket is connected successfully');
            socket.on('UpdatedStock', handleStockUpdate);
        }

        fetchStocks();

        return () => {
            if (socket) {
                socket.off('UpdatedStock', handleStockUpdate);
            }
        };
    }, [socket]);

    const sortedStocks = [...stocks].sort((a, b) => a.branch_id.localeCompare(b.branch_id));

    return (
        <div>
            <h3>Fuel Stocks</h3>
            <center>Minimum Threshold Quantity(For all Types-100)</center>
            {stocks.length === 0 ? (
                <div>Loading or No stocks available.</div>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Branch ID</th>
                            <th>Branch Name</th>
                            <th>Location</th>
                            <th>Petrol (liters)</th>
                            <th>Diesel (liters)</th>
                            <th>CNG (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStocks.map((branch) => (
                            <tr key={branch.branch_id}>
                                <td>{branch.branch_id}</td>
                                <td>{branch.branch_name}</td>
                                <td>{branch.location}</td>
                                <td>{branch.stock_levels.petrol}</td>
                                <td>{branch.stock_levels.diesel}</td>
                                <td>{branch.stock_levels.cng}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageFuelStocks;

