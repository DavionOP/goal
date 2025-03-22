console.log("✅ Simple Sub Goal Overlay Loaded");

let goal = 10; // Default Goal

// Function to update the display
function updateGoalText() {
    document.getElementById("subGoalDisplay").innerText = `${goal}`;
}

// Event: Widget Load (Initialize Goal)
window.addEventListener('onWidgetLoad', function (obj) {
    let fieldData = obj.detail.fieldData;
    goal = fieldData.subGoal || 10; // Load stored goal if available
    updateGoalText();
});

// Event: Handle Chat Command (!setgoal)
window.addEventListener('onEventReceived', function (event) {
    let data = event.detail.event;

    if (event.detail.listener === "message") {
        let msg = data.renderedText.trim();
        
        if (msg.startsWith("!subgoal")) {
            let parts = msg.split(" ");
            let newGoal = parseInt(parts[1], 10);

            if (!isNaN(newGoal) && newGoal > 0) {
                if (data.data.nick.toLowerCase() === "skyrastyles" || 
                    data.data.badges?.includes("moderator")) {
                    goal = newGoal;
                    updateGoalText();
                    console.log(`🎯 Sub goal updated to: ${goal}`);
                } else {
                    console.log(`❌ @${data.data.nick} does not have permission to change the goal.`);
                }
            } else {
                console.log(`❌ Invalid goal input: ${parts[1]}`);
            }
        }
    }
});

// Initialize Display
updateGoalText();
