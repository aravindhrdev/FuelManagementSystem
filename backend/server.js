import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import { initializeSocket } from './socket.js';
import ftrans from './routes/ftrans.js';
import router from './routes/fuelstock.js';
import restock from './routes/restock.js';
import { handleRestockRequest } from './services/suppliercntrl.js';
import dwnldrouter from './routes/dwnld.js';
import updateStock from './events/updatestock.js';
import lowstock from './events/lowstock.js';

dotenv.config();

connectDB();

const app = express();

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

const server = http.createServer(app);

const io = initializeSocket(server, corsOptions);
app.set('io', io);

app.use('/api/fuel-stocks/transactions', ftrans); 
app.use('/api/fuel-stocks/branches', router);
app.use('/api/restock-requests', restock);
app.use('/download-metrics',dwnldrouter);

handleRestockRequest();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
