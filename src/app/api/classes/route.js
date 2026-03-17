// src/app/api/classes/route.js
export async function GET(request) {
  const token = request.headers.get("Authorization");

  const response = await fetch("https://api-kinderbeam.onrender.com/api/classes/", {
    headers: { "Accept": "application/json", "Authorization": token },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}