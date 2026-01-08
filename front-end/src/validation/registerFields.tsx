import { toast } from "sonner";

export function registerFieldsValidation(fullNameReceived:string, emailReceived: string, passwordReceived: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailReceived.trim();
    const password = passwordReceived.trim();
    const fullName = fullNameReceived.trim();

    if (!email || !password || !fullName) {
        toast.error("Preencha todos os campos");
        return false;
    }

    //FullName
    
    if(fullName.length < 3 || fullName.length > 100){
        toast.error("O nome deve ter entre 3 e 100 caracteres");
        return false;
    }


    //Email

    if(email.length > 250){
        toast.error("Email muito longo");
        return false;
    }

    if (!emailRegex.test(email)) {
        toast.error("Formato de email inválido");
        return false;
    }

    //Password

    if (password.length < 6 || password.length > 100) {
        toast.error("A senha deve ter entre 6 e 100 caracteres");
        return false;
    }

    return true;

}