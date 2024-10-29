import Branch from '../models/branch.js';
import { getIO } from '../socket.js';
import emitter from './emitter.js';

const updateStock = async (transaction) => {
    try {
      console.log("Inside update stock event");
      const branch = await Branch.findOne({ branch_id: transaction.branch_id });
      if (!branch) {
        throw new Error('Branch not found');
      }
  
      if (transaction.fuelType === 'petrol') {
        branch.stock_levels.petrol= parseFloat((branch.stock_levels.petrol-transaction.quantity).toFixed(2));
      } else if (transaction.fuelType === 'diesel') {
        branch.stock_levels.diesel= parseFloat((branch.stock_levels.diesel-transaction.quantity).toFixed(2));
      } else if (transaction.fuelType === 'cng') {
        branch.stock_levels.cng= parseFloat((branch.stock_levels.cng-transaction.quantity).toFixed(2));
      }

      await branch.save();

      const io = getIO();
      console.log('Emitting UpdatedStock:', {
        branch_id: branch.branch_id,
        fuel_type: transaction.fuelType,
        stock_levels: branch.stock_levels,
      });
      io.emit('UpdatedStock', {
        branch_id: branch.branch_id,
        fuel_type: transaction.fuelType,
        stock_levels: branch.stock_levels,
      });
  
      const Stock_threshold = 100;
  
      const currentStock = branch.stock_levels[transaction.fuelType];
      if (currentStock < Stock_threshold) {
        console.log("lowstockalert Emitted");
        emitter.emit('lowStockAlert', {
          branch_id: branch.branch_id,
          fuelType: transaction.fuelType,
          requested_quantity: Stock_threshold * 10,
        });
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
};

emitter.on('newTransactionCreated', updateStock);

export default updateStock;