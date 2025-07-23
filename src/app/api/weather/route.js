// app/api/weather/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'New York';

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key missing' }), { status: 500 });
  }

  try {
    const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch weather data' }), { status: res.status });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', details: err.message }), { status: 500 });
  }
}
