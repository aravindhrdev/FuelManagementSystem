import React from 'react';

const Home = () => {
    return (
        <div>
            <center>
            <center><h2>Fuel Management System</h2></center>
            <p>
                This application allows you to efficiently manage fuel stocks and track fuel transactions across different branches.
            </p>
            <h3>Features</h3>
            <ul>
                <p>View and manage fuel transactions from different branches</p>
                <p>Real time stock Updation for each branches</p>
                <p>Real time stock fulfillment request to the supplier API(Simulated)</p>
            </ul>
            </center>
            <div>
                <a href="/manage-fuel" style={{ padding: '10px', background: 'Red', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                    Manage Fuel Stocks and Transactions
                </a>
                <br />
                <br />
                <a href="/restock-requests" style={{ padding: '10px', background: 'Red', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                    Restock Requests
                </a>
                <br/>
                <br/>
                <a href="/download-metrics" style={{ padding: '10px', background: 'Red', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
                    Download Metrics
                </a>
            </div>
        </div>
    );
};

export default Home;
