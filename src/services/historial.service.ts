import { historial } from '@prisma/client';
import { prismaClient } from '../config/prismaClient';

// Algoritmo de GET

type getHistorialParams = { cedula?: string; Nombre?: string; fecha?: string };

async function getHistorial({ cedula, Nombre, fecha }: getHistorialParams): Promise<historial[]> {
	const { historial } = prismaClient;

	if (!cedula) cedula = undefined;

	if (!Nombre) Nombre = undefined;

	let parsedDate: undefined | Date;
	let parsedDateMax: undefined | Date;

	if (fecha) {
		parsedDate = new Date(fecha);

		// composicion de la fecha para que se entienda la extraccion de string - 2022-01-01

		if (parseInt(fecha.slice(5, 7)) === 12) parsedDateMax = new Date(`${parseInt(fecha.slice(0, 4)) + 1}-01-01`);
		else parsedDateMax = new Date(`${fecha.slice(0, 4)}-${parseInt(fecha.slice(5, 7)) + 1}-01`);
	}

	if (cedula === undefined && Nombre === undefined && parsedDate === undefined) return [];
	else {
		const result = await historial.findMany({
			where: {
				cedula,
				Nombre: {
					contains: Nombre,
					mode: 'insensitive'
				},
				AND: [
					{
						fecha: { gte: parsedDate }
					},
					{
						fecha: { lt: parsedDateMax }
					}
				]
			}
		});
		return result;
	}
}

export { getHistorial };

// Algoritmo de PUT

type putHistorialParams = { id: number; entregado: boolean };

const putHistorial = async ({ id, entregado }: putHistorialParams): Promise<any> => {
	const { historial } = prismaClient;

	const currentDate: Date = new Date();

	if (entregado) {
		const result = await historial.update({
			data: { entregado, fecha_entregado: currentDate },
			where: { id }
		});
		return result; // object
	}
};

export { putHistorial };
