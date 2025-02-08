export interface CustomClaims {
    lab_id: string;
    lab_name: string;
};

interface JwtPayload {
    jwt: string;
    sub: string;
    "https://purl.imsglobal.org/spec/lti/claim/custom"?: CustomClaims;
}

///////////
// Define a generic type for the JWT payload
export function decodeJWT<T>(token: string): T | null {
    try {
        // Split the token into its parts
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        // Decode the payload (second part of the JWT)
        const base64 = parts[1]
            .replace(/-/g, '+') // Replace URL-safe Base64 characters
            .replace(/_/g, '/'); // Replace URL-safe Base64 characters

        const decodedPayload = atob(base64);

        // Parse the JSON payload and return as type T
        return JSON.parse(decodedPayload) as T;
    } catch (error) {
        console.error('Error decoding JWT:', error instanceof Error ? error.message : error);
        return null;
    }
}


///////////
export function getJwtCustomClaims(token: string) {
    const decoded = decodeJWT<JwtPayload>(token);
    if (decoded) {
        metaData.jwt = token;
        metaData.sub = decoded.sub;
        const cc = decoded["https://purl.imsglobal.org/spec/lti/claim/custom"] as CustomClaims;
        if (cc) {
            metaData.customClaims = {
                lab_id: cc.lab_id,
                lab_name: cc.lab_name,
            };
        } else {
            console.error('Custom claim is undefined in the JWT payload.');
            return null;
        }
    } else {
        console.error('Custom claim not found in the JWT payload.');
        return null;
    }
}

export type MetaData = {
    jwt: string; // To send to the server
    sub: string;
    customClaims: CustomClaims;
};

// Initialize the state with the MetaData type
export let metaData = $state<MetaData>({
    jwt: '',
    sub: '',
    customClaims: {
        lab_id: '',
        lab_name: '',
    }
});

///////////////////////////////
export interface DataStore {
    tabs: string[];
};

export let Store = $state<DataStore>({
    tabs: []
});
