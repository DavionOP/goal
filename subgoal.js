console.log("subGoal.js script loaded");

let goal = 10; // Initial goal
let currentSubs = 0;

// Function to update the goal text display
function updateGoalText() {
    let subGoalText = document.getElementById("subGoalDisplay");
    if (subGoalText) {
        subGoalText.innerText = `Subscribers: ${currentSubs}/${goal}`;
    } else {
        console.error("SubGoal text element not found.");
    }
}

// Event: Widget Load (fetch initial goal value)
window.addEventListener('onWidgetLoad', function (obj) {
    let fieldData = obj.detail.fieldData;
    goal = fieldData.subGoal || 10;
    updateGoalText();
});

// Event: Handle new subs, gifted subs, and chat commands
window.addEventListener('onEventReceived', function (event) {
    let data = event.detail.event;

    if (data.type === "subscriber" || data.type === "giftedSub") {
        currentSubs += data.amount || 1; // Default to 1 if no amount is provided
        updateGoalText();
    }

    if (data.type === "message") {
        let msg = data.data.text;
        if (msg.startsWith("!setgoal")) {
            let parts = msg.split(" ");
            let newGoal = parseInt(parts[1], 10);
            if (!isNaN(newGoal) && newGoal > 0) {
                const trustedUsers = ["Wavionn"]; // Add more trusted users as needed
                if (trustedUsers.includes(data.data.nick) || (data.data.badges && data.data.badges.includes("moderator"))) {
                    goal = newGoal;
                    updateGoalText();
                    if (typeof SE_API !== "undefined") {
                        SE_API.say(`Sub goal updated to ${goal} subscribers!`);
                    }
                } else {
                    if (typeof SE_API !== "undefined") {
                        SE_API.say(`@${data.data.nick}, you don't have permission to change the goal.`);
                    }
                }
            } else {
                if (typeof SE_API !== "undefined") {
                    SE_API.say(`Invalid goal value! Please enter a number greater than 0.`);
                }
            }
        }
    }
});

// Initialize the overlay display
updateGoalText();
