<script>
    import moment from 'moment';
    import {FORMS_VPIS} from "../../../env.js";

    moment().format();

    let show_parent = false;
    let letoRojstva = null;
    let mesecRojstva = null;
    let danRojstva = null;

    function on_keyup() {
        if (letoRojstva > 1900) {
            let rojstvo = moment(`${letoRojstva}-${mesecRojstva}-${danRojstva}`, "YYYY-MM-DD");
            if (rojstvo.isValid()) {
                let years = moment().diff(rojstvo, 'years', true);
                show_parent = 0 < years < 18;
                return;
            }
        }
        show_parent = false;
    }
</script>
<p class="text-primary">
    Preden podpišeš moraš vedeti da je <b class="text-success">mesečna članarina 40eu</b> katera je namenjena izklučno
    delovanju kluba in v ceni se <b class="text-success">izplača plača trenerjem za njihovo delo,
    najemnina prostorov v osnovnih, srednjih šolah ter za razvoj javnih projektov ki so namenjeni
    izobraževanju članov in širše javnosti.</b></p>


<form action="{FORMS_VPIS}" method="POST">
    <div class="row">
        <div class="col-fill margin-right-small">
            <input class="input-block" name="ime" placeholder="Tvoje ime..." required type="text">
        </div>
        <div class="col-fill">
            <input class="input-block" name="priimek" placeholder="Tvoj priimek..." required type="text">
        </div>
    </div>
    <div class="row">
        <div class="col-fill margin-right-small">
            <input on:keyup={on_keyup} bind:value={danRojstva} name="dan_rojstva" placeholder="Dan rojstva..." required type=number>
        </div>
        <div class="col-fill margin-right-small">
            <input on:keyup={on_keyup} bind:value={mesecRojstva} name="mesec_rojstva" placeholder="Mesec rojstva..." required type=number>
        </div>
        <div class="col-fill">
            <input on:keyup={on_keyup} bind:value={letoRojstva} name="leto_rojstva" placeholder="Leto rojstva..." required type=number>
        </div>
    </div>

    {#if show_parent}
        <div class="row">
            <div class="col-fill margin-right-small">
                <input class="input-block" name="ime_skrbnika" placeholder="Ime skrbnika..." required type="text">
            </div>
            <div class="col-fill">
                <input class="input-block" name="priimek_skrbnika" placeholder="Priimek skrbnika..." required type="text">
            </div>
        </div>
        <div class="row">
            <div class="col-fill margin-right-small">
                <input name="email_skrbnika" placeholder="Email skrbnika (za račune)..." required type="email">
            </div>
            <div class="col-fill">
                <input name="telefon_skrbnika" placeholder="Telefon skrbnika (za nujne primere)..." required type="tel">
            </div>
        </div>
        <div class="row">
            <div class="col-fill margin-right-small">
                <input name="email" placeholder="Tvoj email (če ga imaš)..." type="email">
            </div>
            <div class="col-fill">
                <input name="telefon" placeholder="Tvoj telefon (če ga imaš)..." type="tel">
            </div>
        </div>
    {:else}
        <div class="row">
            <div class="col-fill margin-right-small">
                <input name="email" placeholder="Tvoj email..." required type="email">
            </div>
            <div class="col-fill">
                <input name="telefon" placeholder="Tvoj telefon..." required type="tel">
            </div>
        </div>
    {/if}


    <div class="row flex-spaces">
        <div class="xs-12 sm-6">
            <fieldset class="form-group">
                <label class="paper-check">
                    <input required type="checkbox"> <span>Upošteval bom pravila v <a target="_blank" href="/dokumenti#content">temeljnem aktu kluba</a>.</span>
                </label>
            </fieldset>

        </div>
        <div class="xs-12 sm-6">

            <fieldset class="form-group">
                <label class="paper-check">
                    <input required type="checkbox"> <span>Zaprisegam, da bom redno programiral! :)</span>
                </label>
            </fieldset>
        </div>
        <div class="col-fill">
            <button class="btn-block green" type="submit">Potrdi</button>
        </div>

    </div>
</form>
