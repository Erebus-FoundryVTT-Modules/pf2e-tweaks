const moduleName = "pf2e-tweaks";

const minimalisticClockKey = "minimalisticClock";
const simpleCalendarintegrationKey = "SimpleCalendarIntegration";

Hooks.once("init", async function () {
    game.settings.register(moduleName, minimalisticClockKey, {
    name : "Enable minimalistic world clock",
    hint : "Appears in bottom left corner",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
    });
    
    game.settings.register(moduleName, simpleCalendarintegrationKey, {
    name : "Enable Simple Calendar integration",
    hint : "Defaults to pf2e system time if module isn't available.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
    });
});

let html_playerlist;

function getDateString(){
    const useSimpleCalendar = game.settings.get(moduleName, simpleCalendarintegrationKey);
    //simple calendar integration
    
    if ((typeof SimpleCalendar !== typeof undefined) && useSimpleCalendar) {
    	let timestamp = SimpleCalendar.api.dateToTimestamp({});
    	let worldtime = SimpleCalendar.api.timestampToDate(timestamp);
    	return(worldtime.display.day + worldtime.display.daySuffix + " " + worldtime.display.monthName);
    } else {
		let worldtime = game.pf2e.worldClock.getData();
		let dateonly = worldtime.date;
		dateonly = dateonly.match(/, .*, /)[0].slice(1,-2);
    	return(dateonly);
    }
}

function createClock(){
    const useSimpleCalendar = game.settings.get(moduleName, simpleCalendarintegrationKey);

    html_playerlist.append(`<hr class ="tweaks-line"><button class='tweaks-min-clock'>` + getDateString() + "</div>");
    if ((typeof SimpleCalendar !== typeof undefined) && useSimpleCalendar) {
	    html_playerlist.on('click', '.tweaks-min-clock', (event) => {
			SimpleCalendar.api.showCalendar(null, true);
	    });
    }else{ 
	    html_playerlist.on('click', '.tweaks-min-clock', (event) => {
			game.pf2e.worldClock.render(true);
	    });
    }
    return 0;
}

Hooks.on('renderPlayerList', (playerList, html) =>{
	const minimalisticClockSet = game.settings.get(moduleName, minimalisticClockKey);
    html_playerlist = html;

    let rerender = game.pf2e.worldClock;

    if (typeof rerender !== typeof undefined && minimalisticClockSet){
        createClock();
    }
});

Hooks.on('pf2e.systemReady', () => {
	const minimalisticClockSet = game.settings.get(moduleName, minimalisticClockKey);
    if (minimalisticClockSet) {
        createClock();
    }
});

Hooks.on('updateWorldTime', (currentTime, updateAmount) => {
	const minimalisticClockSet = game.settings.get(moduleName, minimalisticClockKey);
    if (minimalisticClockSet) {
        html_playerlist.children()[3].innerHTML = getDateString();
    }
})
