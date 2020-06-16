
export default class ChallengeHandler {
    userLoginChallengeHandler:any;
    successCallback:any;
    securityCheckName:string;
   
    constructor(securityCheckName, callback) {
        this.securityCheckName = securityCheckName;  
        this.successCallback = callback; 
    }
	

    login(username, password) {
        if (username === "" || password === "") {
            alert("Username and password are required");
            return;
        }

        if (this.userLoginChallengeHandler == null) {
            this.userLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler(this.securityCheckName);
			this.userLoginChallengeHandler.isChallenged = false;
			this.userLoginChallengeHandler.successCallback = this.successCallback;
            this.userLoginChallengeHandler.handleChallenge = function(challenge) {
				WL.Logger.debug("handleChallenge");
				this.isChallenged = true;
				var statusMsg = "Failed to login";
				if (challenge.errorMsg !== null) {
					statusMsg = statusMsg + ". Reason: " + challenge.errorMsg;
				}
				statusMsg = statusMsg + ". Remaining Attempts: " + challenge.remainingAttempts;
				WL.Logger.error(statusMsg);
				alert(statusMsg);
			}

            this.userLoginChallengeHandler.handleSuccess = function (data) {
				WL.Logger.debug("handleSuccess");
                this.isChallenged = false;
                WL.Analytics.setUserContext(data.user.id);
				this.successCallback();					
			
			}
            this.userLoginChallengeHandler.handleFailure = function (error) {
				WL.Logger.debug("handleFailure");
				this.isChallenged = false;
				if (error.failure !== null) {
					WL.Logger.error(error.failure);
					alert("Failed to login. Reason: " + error.failure);
				} else {
					alert("Failed to login.");
				}
			}
        }

        if (this.userLoginChallengeHandler.isChallenged) {
            this.userLoginChallengeHandler.submitChallengeAnswer({ 'username': username, 'password': password });
        } else {
            WLAuthorizationManager.login(this.securityCheckName, { 'username': username, 'password': password }).then(
                function() {
                    WL.Logger.debug("login onSuccess");
                },
                function(response) {
                    WL.Logger.error("login onFailure: " + JSON.stringify(response));
                });
        }
    }   
}
