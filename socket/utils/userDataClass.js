class UserData {
    constructor(socket, sysId) {
      this.socket = socket;
      this.sysId = sysId;
      this.uid = "";
      this.userId = "";
    }

    setUid(uid) {
        this.uid = uid;
    }
    
    setUserId(userId) {
        this.userId = userId;
    }
    
    getSocket() {
        this.socket;
    }
    
    getSysId() {
        this.sysId;
    }
       
    getUid() {
        this.uid;
    }
    
    getUserId() {
        return this.userId;
    }
}

export default UserData;