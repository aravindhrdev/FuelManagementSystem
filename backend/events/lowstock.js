import Branch from '../models/branch.js';
import { getIO } from '../socket.js';
import emitter from './emitter.js';
import RestockRequest from '../models/restock.js';

const lowstock = async (data) => {
    console.log("Low Stock Alert Entered", data);
    const { branch_id, fuelType, requested_quantity } = data;
  
    try {
      const branch = await Branch.findOne({ branch_id });
      if (!branch) {
        console.error('Branch not found for ID:', branch_id);
        return;
      }
  
      const newRequest = new RestockRequest({
        branch_id,
        fuelType,
        requested_quantity,
        status: "pending",
      });
  
      await newRequest.save();
  
      emitter.emit('processRestockRequest', newRequest);
  
      const io = getIO();
      io.emit('newRestockRequest', newRequest);
      console.log('New restock request created and emitted:', newRequest);
    }
    catch (error) {
      console.error('Error creating restock request from low stock alert:', error);
    }
};

emitter.on('lowStockAlert', lowstock);

export default lowstock;
