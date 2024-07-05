export class LoginService {

    private loginUser() {
        window.sessionStorage.setItem('loginUser', 'logged')
    }

    logoutUser() {
        window.sessionStorage.removeItem('loginUser')
    }

    checkIsLogged() {
        const getValue = window.sessionStorage.getItem('loginUser');
        if (getValue) {
            return true
        } else {
            return false
        }
    }

    checkLogin({ userName, password }: { userName?: string, password?: string }): boolean {
        const validUserName = process.env.NEXT_PUBLIC_VALID_USER;
        const validUserPass = process.env.NEXT_PUBLIC_VALID_PASS;

        if ((userName && password) && (validUserName == userName.trim() && validUserPass == password.trim())) {
            this.loginUser()
            return true
        } else {
            return false
        }
    }
}