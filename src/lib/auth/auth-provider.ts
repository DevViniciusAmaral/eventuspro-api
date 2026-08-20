export interface DecodedAuthToken {
  uid: string;
  email: string;
}

export interface AuthProvider {
  verifyToken: (token: string) => Promise<DecodedAuthToken>;
}
