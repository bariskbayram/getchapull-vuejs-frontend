export function isTokenExpired(token) {
  try {
    const decoded = decodeJWT(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (error) {
    return true;
  }
}

function decodeJWT(token) {
  if (!token) {
    throw new Error("Token is required");
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const base64Url = parts[1]; // Payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}
