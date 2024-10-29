import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

export const generateCSV = (res, data) => {
    console.log("Generating Your Favorite CSV File!");
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('metrics.csv');
    console.log("Your CSV file is Ready!");
    res.send(csv);
};

export const generateExcel = (res, data) => {
    console.log("Generating Your Favorite Excel File!");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Metrics');

    worksheet.columns = [
        { header: 'Branch ID', key: 'branchId', width: 15 },
        { header: 'Branch Name', key: 'branchName', width: 20 },
        { header: 'Location', key: 'location', width: 20 },
        { header: 'Fuel Type', key: 'fuelType', width: 15 },
        { header: 'Requested Quantity', key: 'requestedQuantity', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Request Date', key: 'requestedAt', width: 15 },
        { header: 'Confirmation Date', key: 'confirmedAt', width: 15 },
        { header: 'Expected Refill Date', key: 'expectedRefillDate', width: 20 },
    ];

    data.forEach(row => {
        worksheet.addRow(row);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=metrics.xlsx');

    workbook.xlsx.write(res)
        .then(() => {
            console.log("Your CSV file is Ready!");
            res.end();
        })
        .catch(error => {
            console.error('Error generating Excel file:', error);
            res.status(500).send('Error generating Excel file.');
        });
};
