import moment from "moment-timezone";
class Utils {
    randomPasswordForgot() {
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let randomString = "";
        for (let i = 0; i < 3; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            randomString += chars[rnum];
        }
        for (let i = 0; i < 2; i++) {
            let rnum = Math.floor(Math.random() * 10);
            randomString += rnum;
        }
        return randomString;
    };

    toDate(date) {
        let result = new Date(date);
        if (isNaN(result.getTime())) {
            result = new Date(parseInt(date));
        }
        if (isNaN(result.getTime())) {
            throw Error("No time")
        }
        return result;
    }

    getDateCurrent() {
        return moment(new Date()).format("YYYY-MM-DD HH:mm")
    }
}

export default new Utils();