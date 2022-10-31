
export function randomPasswordForgot() {
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
}
