<script>

    import {FORMS_KONTAKT} from "../../../env.js";
</script>

<p>
    Hvala ker ste se odločili vspostaviti kontakt z nami. Na vsak email odgovorimo kar se da hitro.
    V primeru dela lahko pričakujete odgovor najkasneje do večera istega dne na katerega ste poslali sporočilo...
</p>

<form action="{FORMS_KONTAKT}" method="POST">
    <div class="row flex-spaces">
        <div class="col-fill col-sm-4 margin-right-small">
            <input class="input-block" name="ime" placeholder="Ime..." required type="text">
        </div>
        <div class="col-fill col-sm-4 margin-right-small">
            <input class="input-block" name="priimek" placeholder="Priimek..." required type="text">
        </div>
        <div class="col-fill col-sm-4">
            <input placeholder="Email..." name="email" required type="email">
        </div>
    </div>

    <div class="row flex-spaces">
        <div class="col-12">
            <textarea name="sporocilo" placeholder="Sporočilo..." required></textarea>
        </div>
    </div>

    <div class="row flex-spaces">
        <div class="col-12">
            <button class="btn-block green" type="submit">Pošlji</button>
        </div>
    </div>
</form>
