import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getHistorialForm, putHistorialCheck, putHistorialStatus, putHistorialDescrip, deleteUser } from './src/services/historial.service';
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

// Peticion GET Form (Leer datos)

app.get('/historial', async (req: Request, res: Response) => {
	const { cedula, Nombre, fecha, entregado, userViews } = req.query as {
		cedula?: string;
		Nombre?: string;
		fecha?: string;
		entregado?: string;
		userViews?: string;
	};

	const result = await getHistorialForm({ cedula, Nombre, fecha, entregado, userViews });
	res.json(result);
	console.log(req.query, result[1]);
});

// Peticion PUT Check - fecha entregado and entregado (Actualizar datos)

app.put('/entregados/:id', async (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	const { data } = req.body as { data: boolean };

	const result = await putHistorialCheck({ id, data });
	res.json(result);
	console.log(req.body, result);
});

// Peticion PUT Description (Actualizar datos)

app.put('/descripciones/:id', async (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	const { data } = req.body as { data?: string };

	const result = await putHistorialDescrip({ id, data });
	res.json(result);
	console.log(req.body, result);
});

// Peticion - DELETE User

app.delete('/eliminados/:id', async (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	const result = await deleteUser(id);
	res.json(result);
	console.log(result);
});

// Peticion PUT Status (Actualizar datos)

app.put('/estado/:id', async (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	const { data } = req.body as { data: unknown };

	const result = await putHistorialStatus({ id, data });
	res.json(result);
	console.log(req.body, result);
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
