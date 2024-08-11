import express from 'express';
import bodyParser from 'body-parser';
import identifyRoutes from './routes/identify';

const app = express();

app.use(bodyParser.json());
app.use('/api', identifyRoutes);

export default app;
