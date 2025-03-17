<script lang="ts">
	import type { Weather } from '../types';

	let cityQuery = $state('');
	let weather: Weather | null = $state(null);
	let isLoading = $state(false);
	let error: string | null = $state(null);
	let timer: number | undefined = $state(undefined);

	const debounce = (v: string) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			cityQuery = v;
		}, 750);
	};

	const fetchWeather = async () => {
		try {
			isLoading = true;
			error = null;

			const response = await fetch(`/api/weather?city=${cityQuery}`);

			if (response.ok) {
				weather = (await response.json()) as Weather;
			} else if (response.status === 404) {
				weather = null;
				error = ((await response.json()) as { error: string }).error;
			}
		} catch (error) {
			weather = null;
			error = 'Unexpected error happened';
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
	<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
		<h1 class="mb-4 text-center text-2xl font-semibold text-gray-800">Weather Dashboard</h1>

		<!-- Search Bar -->
		<div class="flex items-center space-x-2">
			<input
				type="text"
				placeholder="Enter city name..."
				class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
				onkeyup={(e) => debounce((e.target as HTMLInputElement).value)}
			/>
			<button
				class="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:cursor-wait disabled:opacity-30"
				onclick={() => fetchWeather()}
				disabled={isLoading}
			>
				{isLoading ? 'Wait...' : 'Search'}
			</button>
		</div>

		<!-- Weather Display -->
		<div class="mt-6 rounded-lg bg-gray-50 p-4 text-center shadow">
			{#if isLoading}
				<div class="flex flex-col items-center">
					<div class="h-7 w-[200px] animate-pulse bg-gray-200"></div>
					<div class="mt-2 h-10 w-[300px] animate-pulse bg-gray-200"></div>
					<div class="mt-1 h-6 w-[150px] animate-pulse bg-gray-200"></div>
				</div>
			{:else if error}
				<span>{error}</span>
			{:else if weather}
				<p class="text-lg font-medium text-gray-700">
					🌍 City: <span class="font-semibold">{weather?.city}</span>
				</p>
				<p class="mt-2 text-4xl font-bold text-blue-600">{weather?.temperature}°C</p>
				<p class="text-md mt-1 text-gray-600">{weather?.condition}</p>
			{:else}
				<span>Please enter city</span>
			{/if}
		</div>
	</div>
</div>
