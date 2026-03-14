export interface MicrosoftTokenResponse {
    access_token: string;
    id_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}
export interface MicrosoftProfile {
    oid: string;
    email: string;
    displayName: string;
}
