// ---------------------------------------------------------------
// src/app/api/emergencies/route.js  →  route: /api/emergencies
// Server-side proxy — GET all emergencies.
// ---------------------------------------------------------------

export async function GET(request) {
  const token = request.headers.get("Authorization");

  const response = await fetch("https://api-kinderbeam.onrender.com/api/emergencies/", {
    method: "GET",
    headers: { "Accept": "application/json", "Authorization": token },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}