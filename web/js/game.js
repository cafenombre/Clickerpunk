// IMPORTANT
// rps: Robot Per Second
// END IMPORTANT



// Init the different game variables
var Game = {};
Game.robot_count = 0;
Game.robot_factor_build = 1;
Game.build_sec_factories = 1;
Game.slots = {"slot_1": 1};
Game.number_factories = 100;
Game.robot_level = 1;

// Keep the block in a global var to save memory
var robot_count_block = document.querySelector('.robot-count-content');

// --- Static values @TODO: Should it stay as is or in a new json file ?
// Costs using robots (first robot type)
var costs = {"factory_0": 10000, "factory_1": 100, "factory_2": 500, "factory_3": 5000, "upgrade_robot": 10};
// Number of robots per factory level
var factor_factory_level = {"factory_-1": 0, "factory_0": 0, "factory_1": 1, "factory_2": 5, "factory_3": 10};

/**
 * Game updater
 * Updates the robot built per second (e.g. used when a factory has been upgraded)
 */
function update_build_sec_factories() {
    var persec = 0;
    for (var slot in Game.slots) {
        persec += factor_factory_level["factory_" + Game.slots[slot]] * Game.robot_level;
    }
    Game.build_sec_factories = persec;
}

/**
 * Frontend updater
 * Change the value of the counter on the page
 */
function update_clicker() {
    robot_count_block.innerHTML = String(Math.round(parseFloat(Game.robot_count)));
}

/**
 * Frontend updater
 * Fill cells which match the slot level (see Game.slots)
 * Always update the rps
 */
function update_factories() {
    update_build_sec_factories()

    for (var slot in Game.slots) {
        for (var i=0; i<=Game.slots[slot]; i++) {
            document.querySelectorAll('table[data-slot=' + slot + '] .slot_cell_'+i).forEach(function (cell) {
                cell.style.background = '#ccc';
            });
        }
    }
}

/**
 * Frontend updater
 * Changes the robot level
 */
function update_robot_details() {
    document.querySelector('.robot-level-content').innerHTML = Game.robot_level;
}

/**
 * Frontend updater
 * Highlight the affordable slots/factories/upgrades ...
 *
 */
function affordable() {
    // Slots
    document.querySelectorAll('.town table').forEach(function (table) {
        table.style.border = '1px solid #ccc';
    });
    for (var i=0; i<4; i++) {
        console.log(price_factory(i));
        if (Game.robot_count >= price_factory(i))
            document.querySelectorAll('.town table[data-level="'+(i-1)+'"]').forEach(function (table) {
                table.style.border = '1px solid yellow';
            });
    }
}

/**
 * Using the factory type (0 <= type <= 3), calculate the price of the next same type
 * The second factory N will be more expensive than the first factory N
 *
 * @param   type      the level of the factory
 * @returns {number}  the price
 */
function price_factory(type) {
    var count_f = 0;

    for (s in Game.slots)
        if (Game.slots[s] >= type)
            count_f++;

    count_f = (count_f === 0) ? 1:count_f;

    return costs['factory_'+type] * count_f;
}

/**
 * Check if the user can buy a factory
 *
 * @param   request    the level of the the factory
 * @returns {boolean}  the decision
 */
function can_afford_factory(request) {
    return (Game.robot_count >= price_factory(request));
}

/**
 * Check if the robot can be upgraded
 *
 * @param   level     the robot's level
 * @returns {boolean} the decision
 */
function can_afford_upgrade(level) {
    return (Game.robot_count >= costs['upgrade_robot']*level*0.8)
}

/**
 * Check if the user can upgrade a factory
 *
 * @param   slot        the slot to check
 * @param   lvlRequest  the level wanted (usually slot level + 1)
 * @returns {boolean}   the decision
 */
function can_evolve_factory(slot, lvlRequest) {
    var current_level = Game.slots[slot];
    return (lvlRequest > current_level && lvlRequest - current_level === 1);
}

/**
 * Pay for the factory
 * Always recheck if it's affordable, update the clicker and recheck what the user can afford
 *
 * @param request  the factory level
 */
function pay_factory(request) {
    if (price_factory(request) <= Game.robot_count)
        Game.robot_count = Game.robot_count-price_factory(request);
    update_clicker();
    affordable();
}

/**
 * Pay for a robot
 * Always recheck if it's affordable, update the clicker and recheck what the user can afford
 *
 * @param level  the robot level
 */
function pay_robot(level) {
    if (costs['upgrade_robot']*level*0.8 <= Game.robot_count)
        Game.robot_count = Game.robot_count-costs['upgrade_robot']*level*0.8;
    update_clicker();
    affordable();
}

/**
 * The automatic robot build function
 * for the sake of display, this function is called every 100ms
 * which means that the rps must be divided by 10
 *
 */
function auto_build() {
    Game.robot_count += parseFloat(Game.build_sec_factories/10 * Game.robot_factor_build);
    update_clicker();
}

update_build_sec_factories(); // Init the rps
setInterval(auto_build, 100); // auto build every 100 ms
setInterval(affordable, 2000); // check affordable stuff but not every 100 ms ...


// --- EVENTS

// Clicker to build robots
document.querySelector('.main-click').addEventListener('click', function () {
    Game.robot_count = Game.robot_count + Game.robot_level;
    update_clicker();
});

// Buy or upgrade a slot
document.querySelectorAll('.town .slot').forEach( function (slot) {
   slot.addEventListener('click', function () {
        var number_slot = slot.getAttribute('data-slot');
        if (!Game.slots.hasOwnProperty(number_slot))
            Game.slots[number_slot] = -1;
        console.log(Game.slots);
        var request_slot = Game.slots[number_slot]+1;

        if (can_evolve_factory(number_slot, request_slot)) {
            if (can_afford_factory(request_slot)) {
                Game.slots[number_slot]++;
                slot.setAttribute('data-level', request_slot);
                pay_factory(request_slot);
                update_factories();
            }
        }
   })
});

// Upgrade robots
document.querySelector('.upgrade-robot-level').addEventListener('click', function () {
    console.log(can_afford_upgrade(Game.robot_level+1));
    if (can_afford_upgrade(Game.robot_level+1)) {
        Game.robot_level++;
        pay_robot(Game.robot_level);
        update_robot_details();
    }
});