
import  * as jwt_decode from 'jwt-decode';

/**
 * Decodes the JWT token and returns the payload.
 * @returns {Object|null} The decoded token payload or null if no token is present.
 */
export const getDecodedToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        return jwt_decode(token);
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
};

/**
 * Retrieves the role from the decoded token.
 * @returns {string|null} The role from the token payload or null if no token is present.
 */
export const getRoleFromToken = () => {
    const decoded = getDecodedToken();
    return decoded ? decoded.role : null;
};


export const getStatusFromToken = () => {
    const decoded = getDecodedToken();
    return decoded ? decoded.status : null;
  };
  