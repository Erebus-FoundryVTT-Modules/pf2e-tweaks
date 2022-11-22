(function() {
    function award_xp_pf2(type, amount) {
        // set of players to distribute. 
        let actors = game.actors.contents.filter(e => e.data.type === 'character' && e.hasPlayerOwner);
        //now deciding XP amount based on encounter type
        let xp_amount = amount;
        if (type == "trivial") xp_amount = 40;
        if (type == "low") xp_amount = 60;
        if (type == "moderate") xp_amount = 80;
        if (type == "severe") xp_amount = 120;
        if (type == "extreme") xp_amount = 160;
        if (type == "minor") xp_amount = 10;
        if (type == "moderate_acc") xp_amount = 30;
        if (type == "major") xp_amount = 80;

        if (actors.length > 0 && Number.isInteger(xp_amount)) {
            let msg = `
              <b> ${xp_amount} XP awarded to party! </b> 
              <br> Recipients: 
              `;
            actors.forEach(actor => {
                msg += `${actor.name}, `;
                actor.update({ "data.details.xp.value": actor.data.data.details.xp.value + xp_amount });
            });
            msg = msg.substring(0, msg.length - 2);
            msg += '.';
            let chatMessageData = {
                user: game.user.id,
                speaker: ChatMessage.getSpeaker(),
                content: msg,
                type: CONST.CHAT_MESSAGE_TYPES.OTHER
            };
            ChatMessage.create(chatMessageData);
        }

    }

    new Dialog({
        title: "Award Party XP",
        content: `
     <b>Select encounter difficulty or enter custom amount.</b>
     <form>
      <div class="form-group">
       <label>Award for</label>
       <select id="award-type">
        <option value="custom">Custom</option>
        <option value="trivial">Trivial encounter (40 exp)</option>
        <option value="low">Low encounter (60 exp)</option>
        <option value="moderate">Moderate encounter (80 exp)</option>
        <option value="severe">Severe encounter (120 exp)</option>
        <option value="extreme">Extreme encounter (160 exp)</option>
        <option value="minor">Minor accomplishment (10 exp)</option>
        <option value="moderate_acc">Moderate accomplishment (30 exp)</option>
        <option value="major">Major accomplishment (80 exp)</option>
       </select>
      </div>
      <div class="form-group">
       <label>Amount</label>
       <input type="text" inputmode="numeric" pattern="\d*" id="custom-xp-amount">
      </div>
     </form>
     `,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Confirm",
                callback: (html) => {
                    let type = html.find('[id=award-type]')[0].value;
                    let amount = parseInt(html.find('[id=custom-xp-amount]')[0].value);
                    award_xp_pf2(type, amount);
                }
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel",
            }
        },
        default: "Cancel"
    }).render(true);
})();
