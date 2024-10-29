import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../Socket';

const RestockRequests = () => {
  const [requests, setRequests] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/restock-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching restock requests:', error);
      }
    };

    if (socket) {
      socket.on('newRestockRequest', (newRequest) => {
        console.log("Restock is requested and in process..",newRequest);
        setRequests((prevRequests) => [...prevRequests, newRequest]);
      });

      socket.on('restockRequestUpdated', (updatedRequest) => {
        console.log("Restock is done ....",updatedRequest);
        setRequests((prevRequests) => 
          prevRequests.map((request) =>
            request._id === updatedRequest._id ? updatedRequest : request
          )
        );
      });
    }

    fetchRequests();

    return () => {
      if (socket) {
        socket.off('newRestockRequest');
        socket.off('restockRequestUpdated');
      }
    };
  }, [socket]);
  const styles = {
    olist:{
        display:"flex",
        flexDirection : "row",
        justifyContent: "space-around",
        margin : "auto",
        border:5,
        listStyleType : 'None',
        flexWrap: 'wrap',
    },
    ilist:{
        textAlign:"justify",
        padding: 2,
        Backgroundcolor:'Blue'
    }
  }
  return (
    <div>
      <h2>Restock Requests</h2>
      <ul style={styles.olist}>
        {requests.map((request) => (
          <li key={request._id} style={styles.ilist}>
            <p><strong>Branch ID:</strong> {request.branch_id}</p>
            <p><strong>Fuel Type:</strong> {request.fuelType}</p>
            <p><strong>Requested Quantity:</strong> {request.requested_quantity}</p>
            <p><strong>Status:</strong> {request.status}</p>
            <p><strong>Requested At:</strong> {new Date(request.requested_at).toLocaleString()}</p>
            <p><strong>Expected Refill Date:</strong> {new Date(request.expected_refill_date).toLocaleString()}</p>
            <p><strong>Confirmed At:</strong> {request.confirmed_at ? new Date(request.confirmed_at).toLocaleString() : 'Not confirmed'}</p>
            <hr/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestockRequests;
