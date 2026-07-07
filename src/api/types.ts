/**
 * Types mirroring the API contract exactly, derived from the OpenAPI spec at
 * https://frontend-assignment-api.goodrequest.dev/apidoc/ (`/apidoc/data.json`).
 */

export interface Shelter {
  id: number;
  name: string;
}

/** GET /api/v1/shelters/ */
export interface SheltersResponse {
  shelters?: Shelter[];
}

/** GET /api/v1/shelters/results */
export interface DonationStats {
  contributors: number;
  contribution: number | null;
}

export type ApiMessageType = "ERROR" | "WARNING" | "INFO" | "SUCCESS";

export interface ApiMessage {
  message: string;
  type: ApiMessageType;
}

/** POST /api/v1/shelters/contribute — response body (success and error). */
export interface ContributeResponse {
  messages: ApiMessage[];
}

export interface Contributor {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
}

/** POST /api/v1/shelters/contribute — request body. */
export interface ContributeRequest {
  contributors: Contributor[];
  shelterID?: number | null;
  value: number;
}
