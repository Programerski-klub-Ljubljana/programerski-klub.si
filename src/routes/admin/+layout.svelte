<script>
    import {UserApi} from "../../api";
    import * as utils from "../../utils";

    console.log('GUARD')
    UserApi.info().then((user) => {
        alert(JSON.stringify(user, null, 4));
    }).catch(() => utils.route('/admin/login'));
</script>
<slot></slot>
