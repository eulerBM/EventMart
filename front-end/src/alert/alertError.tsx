import { toast } from "sonner";

export function alertError(status: number, text: string) {

    if(status >= 500){

        return toast.error(text)

    }

    if(status >= 400){

        return toast.warning(text)

    }

    if(status >= 300){

        return toast.info(text)

    }

}