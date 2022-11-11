<script lang="ts">
    import {UserApi} from "../../api";
    import {goto} from "$app/navigation";
    import {browser} from "$app/environment";
    import {redirect} from "@sveltejs/kit";

    UserApi.info().then(user => {
        console.log('Hello', user)
    }).catch(err => {
        console.log('Not authorized', err);
        if (!browser) redirect(307, '/admin/login');
        else goto('/admin/login');
    });
</script>


<h1>Dashboard</h1>
