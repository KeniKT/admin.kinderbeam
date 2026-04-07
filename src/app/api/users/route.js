// ---------------------------------------------------------------
// src/app/api/users/route.js  →  route: /api/users
// Server-side proxy — GET all users, POST create user.
// ---------------------------------------------------------------

export async function GET(request) {
  const token = request.headers.get("Authorization");

  const response = await fetch("https://api-kinderbeam.onrender.com/api/users/", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": token,
    },
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function POST(request) {
  const token = request.headers.get("Authorization");
  const body = await request.json();

  const response = await fetch("https://api-kinderbeam.onrender.com/api/users/", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}