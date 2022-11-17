
class usersModel {
    convertData(data) {
        return {
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: data.avatar,
            phone: data.phone,
            email: data.email,
            address: data.address
        }
    }
}

export default new usersModel();