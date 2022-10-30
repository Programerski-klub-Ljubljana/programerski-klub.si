import type { PageLoad } from './$types';

export const load: PageLoad = async ({params}) => {
    const res_org = await fetch('https://api.github.com/users/Programerski-klub-Ljubljana');
    const res_repos = await fetch('https://api.github.com/users/Programerski-klub-Ljubljana/repos');
    const org = res_org.json();
    const repos = await res_repos.json();
    return {org, repos};
}
