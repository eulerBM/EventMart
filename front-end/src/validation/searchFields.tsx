import { toast } from "sonner";

export function searchFieldsValidation(searchReceived: string): boolean {
    const search = searchReceived.trim();

    if (!search) {
        toast.error("Preencha o campo");
        return false;
    }

    //Search

    if(search.length > 500){
        toast.error("Campo de procura muito longo");
        return false;
    }

    return true;

}