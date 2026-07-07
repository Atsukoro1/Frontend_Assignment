import type {
  ApiMessage,
  ContributeRequest,
  ContributeResponse,
  DonationStats,
  SheltersResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://frontend-assignment-api.goodrequest.dev/api/v1";

/** Error carrying the HTTP status and any structured messages the API returned. */
export class ApiError extends Error {
  readonly status: number;
  readonly messages: ApiMessage[];

  constructor(status: number, messages: ApiMessage[]) {
    super(messages[0]?.message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.messages = messages;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let messages: ApiMessage[] = [];
    try {
      const body = (await response.json()) as Partial<ContributeResponse>;
      messages = body.messages ?? [];
    } catch {
      // Non-JSON error body — fall back to the status-based message.
    }
    throw new ApiError(response.status, messages);
  }

  return (await response.json()) as T;
}

export function getShelters(): Promise<SheltersResponse> {
  return request<SheltersResponse>("/shelters/");
}

export function getDonationStats(): Promise<DonationStats> {
  return request<DonationStats>("/shelters/results");
}

export function postContribution(body: ContributeRequest): Promise<ContributeResponse> {
  return request<ContributeResponse>("/shelters/contribute", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
