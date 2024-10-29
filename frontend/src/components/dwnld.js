import React, { useState } from 'react';
import axios from 'axios';

const DownloadMetrics = () => {
    const [branchId, setBranchId] = useState('');
    const [branchName, setBranchName] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [format, setFormat] = useState('csv');

    const handleDownload = async () => {
        const params = new URLSearchParams({
            branchId,
            branchName,
            dateFrom,
            dateTo,
            format,
        });
        console.log('Download params:', params.toString());

        try {
            const response = await axios.get(`http://localhost:3000/download-metrics?${params.toString()}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `metrics.${format}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading metrics:', error);
        }
    };

    return (
        <div>
            <h2>Download Metrics</h2>
            <input type="text" placeholder="Branch ID" value={branchId} onChange={(e) => setBranchId(e.target.value)} />
            <input type="text" placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
            </select>
            <button onClick={handleDownload}>Download</button>
        </div>
    );
};

export default DownloadMetrics;
