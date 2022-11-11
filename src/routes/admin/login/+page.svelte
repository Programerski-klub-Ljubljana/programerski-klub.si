<script>
    import {OpenAPI, UserApi} from "/src/api/index.ts";
    import * as utils from "../../../utils";

    let username = "";
    let password = "";
    console.log('login');

    function log() {
        UserApi.login({password, username}).then(token => {
            OpenAPI.TOKEN = token.access_token;
            utils.route('/admin');
        }).catch(err => {
            alert(err);
        });
    }
</script>

<div class="row flex-spaces">
    <div class="col-fill col-sm-4 margin-right-small">
        <input class="input-block" bind:value={username} placeholder="Username..." required type="text">
    </div>
    <div class="col-fill col-sm-4 margin-right-small">
        <input class="input-block" bind:value={password} placeholder="Password..." required type="text">
    </div>
</div>

<div class="row flex-spaces">
    <div class="col-12">
        <button on:click={log} class="btn-block green" type="submit">Pošlji</button>
    </div>
</div>
