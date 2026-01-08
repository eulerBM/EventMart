import { toast } from "sonner";

export function alertError(status: number, text: string) {

    if(status >= 500){

        toast.error(text)

    }

    if(status >= 400){

        toast.warning(text)

    }

    if(status >= 300){

        toast.info(text)

    }

}