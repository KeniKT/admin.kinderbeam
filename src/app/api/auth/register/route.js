// ---------------------------------------------------------------
// src/app/api/auth/register/route.js  →  route: /api/auth/register
// Server-side proxy — registers a new user account.
// ---------------------------------------------------------------

export async function POST(request) {
  const token = request.headers.get("Authorization");
  const body  = await request.json();

  const response = await fetch("https://api-kinderbeam.onrender.com/api/auth/register/", {
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