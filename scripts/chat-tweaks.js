const moduleName = "pf2e-tweaks";

const compactRollsKey = "compactRolls";
const alternativeMarginKey = "alternativeMargin";

Hooks.once("init", async function() {
    game.settings.register(moduleName, compactRollsKey, {
        name: "More compact chat cards",
        hint: "Saves 1 line from AC-DC comparsion rolls by combining name and result",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register(moduleName, alternativeMarginKey, {
        name: "Replace by x with (AC +x)",
        hint: "",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
});


Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(moduleName);
  });


function log(force, ...args) {
    try {
        const isDebugging = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(moduleName);
  
        if (force || isDebugging) {
            console.log(moduleName, '|', ...args);
        }
    } catch (e) {}
}
  


Hooks.on("preCreateChatMessage", async(message, data, options, userId) => {
    const compactRolls = game.settings.get(moduleName, compactRollsKey);
    const alternativeMargins = game.settings.get(moduleName, alternativeMarginKey);

    if (!compactRolls) // module is disabled by settings 
    {
        return;
    }

    let chat_dc = data?.flags?.pf2e?.context?.dc;


    log(false, "Chat DC: ", chat_dc);

    if (typeof chat_dc == typeof undefined) { // this chat message does not contain roll-DC comparsion, exiting
        return;
    }

    if (chat_dc.label.substring(0, 8) == "Recovery"){ // Recovery checks shouldn't be compacted
        return;
    }

    let roll_dc;
    let full_label;
    let ACorDC;
    let original_flavor = data.flavor;
        
    roll_dc = chat_dc.value;
    full_label = chat_dc.label;
    ACorDC = (full_label + ".").slice(-3, -1);


    log(false, "ACorDC: ", ACorDC);

    let target_name;

    if (compactRolls) {

        let target_name = full_label.slice(0, -7);

        let new_flavor = original_flavor.replace(full_label, "").replace("<div data-visibility=\"gm\"><b></b></div>", "");
        new_flavor = new_flavor.replace("Result: ", target_name + ": ");
        message.data.update({ "flavor": new_flavor });

    }

    if (alternativeMargins) {
        let original_flavor2 = message.data.flavor;
        let new_dc_message;

        let roll_margin = parseInt(data.content) - roll_dc;

        let original_margin = original_flavor.match(/by [\+\-]\d+/);

        original_margin = original_margin[0].slice(3);

        new_dc_message = "(" + ACorDC + " " + original_margin + ")";

        let new_flavor2 = original_flavor2.replace(/by [\+\-]\d+/, new_dc_message);

        message.data.update({ "flavor": new_flavor2 });
    }

});