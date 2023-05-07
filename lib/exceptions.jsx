export class AuthException extends Error{
    constructor(message = "Authentication is required to access this Page."){
        super(message);
        this.name = "AuthException"
    }
    
}