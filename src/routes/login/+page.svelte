<script>
    import {USER_LOGIN} from "../../env.js";

    let gotoDashBoard = '/dashboard'
</script>

<div class="container-xs">
    <div class="row flex-spaces">
        <div class="sm-6 col">
            <div class="child-borders">
                <div class="sm-12 col shadow">
                    <form action="{USER_LOGIN}" method="post">
                    <div class="row">
                        <div class="col sm-12">
                            <div class="form-group">
                                <label for="paperInputs2">Uporabniško ime:</label>
                                <input class="input-block" name="username" type="text" id="paperInputs2">
                            </div>
                        </div>
                        <div class="col sm-12">
                            <div class="form-group">
                                <label for="paperInputs3">Geslo:</label>
                                <input class="input-block" name="password" type="text" id="paperInputs3">
                            </div>
                        </div>
                        <div class="col sm-12">
                            <button type="submit" class="btn-block btn-danger">Vpis</button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

