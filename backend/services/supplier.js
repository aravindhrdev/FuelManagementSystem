import RestockRequest from '../models/restock.js';
import { getIO } from '../socket.js';

export const handleSupplierLogic = async (newRequest) => {

  const io = getIO();

  try {
    setTimeout(async () => {
      const expectedRefillDate = new Date(); 
      expectedRefillDate.setDate(expectedRefillDate.getDate() + 2);

      const updatedRequest = await RestockRequest.findByIdAndUpdate(
        newRequest._id,
        {
          expected_refill_date: expectedRefillDate,
          status: 'confirmed',
          confirmed_at: new Date(),
        },
        { new: true }
      );

      if (!updatedRequest) {
        console.error('Restock request not found:', newRequest._id);
        return;
      }

      io.emit('restockRequestUpdated', updatedRequest);
      console.log('Restock request updated and emitted:', updatedRequest);
    }, 5000);
  } catch (error) {
    console.error('Error handling supplier logic:', error);
  }
};

export default handleSupplierLogic;
