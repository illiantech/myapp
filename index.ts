import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { historial } from '@prisma/client';
import { prismaClient } from './src/config/prismaClient';
import { getHistorial } from './src/services/historial.service';
import cors from 'cors';

dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT;

// CORS: permisos sobre que URLs pueden solicitar peticiones
app.use(
	cors({
		origin: '*'
	})
);

// installer npm body parse
app.use(
	express.urlencoded({
		extended: true
	})
);

app.get('/historial', async (req: Request, res: Response) => {
	const { cedula, fecha } = req.query as { cedula?: string; fecha?: string };

	const result = await getHistorial({
		cedula,
		fecha
	});
	res.json(result);
	console.log(req.query);
});

app.put('/entregados/:id', async (req: Request, res: Response) => {
	const { historial } = prismaClient;

	const id: number = parseInt(req.params.id);

	const { entregado } = req.body as { entregado: boolean };

	const result = await historial.update({
		where: { id },
		data: { entregado }
	});
	res.json(result);
	console.log(req.body);
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
