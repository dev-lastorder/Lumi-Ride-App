export const getAuthHeaders = (jwtToken: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${jwtToken}`,
});
