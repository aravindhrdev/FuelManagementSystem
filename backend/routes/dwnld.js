import express from 'express';
import {generateCSV,generateExcel} from '../services/metricsdwnld.js';
import Branch from '../models/branch.js';
import RestockRequest from '../models/restock.js';

const dwnldrouter = express.Router();

dwnldrouter.get('/', async(req,res)=>{
    const { branchId, branchName, dateFrom, dateTo, format } = req.query;

    console.log("Download routes entered");
    const branchFilter = {};
    if (branchId) branchFilter.branch_id = branchId;
    if (branchName) branchFilter.branch_name = branchName;

    try {

        const branches = await Branch.find(branchFilter);
        if (!branches.length) {
            return res.status(404).send('No branches found with the provided criteria.');
        }

        const restockFilter = {
            requested_at: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
        };

        if (branchId) {
            restockFilter.branch_id = branchId;
        } else if (branchName && branches.length > 0) {
            const branchIds = branches.map(branch => branch.branch_id);
            restockFilter.branch_id = { $in: branchIds };
        }

        const refills = await RestockRequest.find(restockFilter);

        const combinedData = [];

        branches.forEach(branch => {
            const branchRefills = refills.filter(refill => refill.branch_id === branch.branch_id);
            branchRefills.forEach(refill => {
                combinedData.push({
                    branchId: branch.branch_id,
                    branchName: branch.branch_name,
                    location: branch.location,
                    fuelType: refill.fuelType,
                    requestedQuantity: refill.requested_quantity,
                    status: refill.status,
                    expectedRefillDate: refill.expected_refill_date ? refill.expected_refill_date.toISOString().split('T')[0] : '',
                    confirmedAt: refill.confirmed_at ? refill.confirmed_at.toISOString().split('T')[0] : '',
                    requestedAt: refill.requested_at ? refill.requested_at.toISOString().split('T')[0] : '',
                });
            });
        });

        if (combinedData.length === 0) {
            return res.status(404).send('No restock requests found for the specified criteria.');
        }

        const fileFormat = format || 'csv';
        if (fileFormat === 'csv') {
            generateCSV(res, combinedData);
        } else if (fileFormat === 'xlsx') {
            generateExcel(res, combinedData)
        } else {
            res.status(400).send('Invalid format specified. Choose either csv or xlsx.');
        }
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default dwnldrouter;
