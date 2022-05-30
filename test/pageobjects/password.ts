import { Navigation } from './navigation';

export class PasswordView {
    async login(password) {
        const passwordInput = await $('.password-field');
        await passwordInput.setValue(password);

        const submit = await $('.submit-btn');
        await submit.click();
        return new Navigation();
    }
}
