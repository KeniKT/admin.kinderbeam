// ---------------------------------------------------------------
// src/app/api/auth/login/route.js
// Server-side route — logs in, then checks role before granting access.
// ---------------------------------------------------------------

export async function POST(request) {
  const body = await request.json();

  // Step 1: Login and get tokens
  const loginResponse = await fetch("https://api-kinderbeam.onrender.com/api/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
  });

  const loginData = await loginResponse.json();

  if (!loginResponse.ok) {
    return Response.json(
      { detail: loginData.detail || "Invalid username or password." },
      { status: 401 }
    );
  }

  // Step 2: Use access token to get user info
  const meResponse = await fetch("https://api-kinderbeam.onrender.com/api/auth/me/", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${loginData.access}`,
    },
  });

  const meData = await meResponse.json();

  if (!meResponse.ok) {
    return Response.json(
      { detail: "Failed to verify user role." },
      { status: 401 }
    );
  }

  // Step 3: Check role_id — only Admin (role_id: 2) can access
  if (meData.role?.role_id !== 2) {
    return Response.json(
      { detail: "Access denied. Only admins can log in to this portal." },
      { status: 403 }
    );
  }

  // Step 4: All good — return tokens and user info
  return Response.json({
    access: loginData.access,
    refresh: loginData.refresh,
    user: meData,
  }, { status: 200 });
}