import {goto} from "$app/navigation";
import {redirect} from "@sveltejs/kit";
import {browser} from "$app/environment";

export function route(path: string) {
    if (!browser) redirect(307, path);
    else goto(path);
}
