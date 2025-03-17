import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { Weather } from '../../../types';

// Mock data store
const mockWeatherData: Weather[] = [
	{
		city: 'Berlin',
		temperature: 15,
		condition: 'Cloudy'
	},
	{
		city: 'Paris',
		temperature: 18,
		condition: 'Sunny'
	},
	{
		city: 'London',
		temperature: 12,
		condition: 'Rainy'
	}
];

export const GET: RequestHandler = async ({ url }) => {
	const city = url.searchParams.get('city');

	if (!city) {
		return json({ error: 'City parameter is required' }, { status: 404 });
	}

	// Simulate async API call
	const weather = await new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockWeatherData.find((w) => w.city.toLocaleLowerCase() === city.toLocaleLowerCase()));
		}, 150); // Simulate network latency
	});

	if (!weather) {
		return json({ error: 'City not found' }, { status: 404 });
	}

	return json({ city, ...weather });
};
