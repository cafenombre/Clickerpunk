// IMPORTANT
// rps: Robot Per Second
// END IMPORTANT



// Init the different game variables
var Game = {};
Game.robot_count = 1;
Game.robot_factor_build = 1;
Game.build_sec_factories = 1;
Game.slots = {"slot_1": 1};
Game.number_factories = 100;
Game.robot_level = 1;
Game.robot_upgrade_level = 1;

// Keep the block in a global var to save memory
var robot_count_block = document.querySelector('.robot-count-content');

// --- Static values @TODO: Should it stay as is or in a new json file ?
// Costs using robots (first robot type)
var costs = {"factory_0": 5000, "factory_1": 600, "factory_2": 1500, "factory_3": 5000,
             "upgrade_robot": 10, "upgrade_next_robot": 700};
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
            document.querySelectorAll('table[data-slot="' + slot + '"] .slot_cell_'+i).forEach(function (cell) {
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
    document.querySelector('.robot-type-content').innerHTML = Game.robot_upgrade_level;
}

/**
 * Frontend updater
 * Highlight the affordable slots/factories/upgrades ...
 *
 */
function affordable() {
    // Slots
    document.querySelectorAll('.town table').forEach(function (table) {
        table.style.border = '';
    });
    for (let i=0; i<4; i++) {
        if (can_afford_factory(i)) {
            document.querySelectorAll('.town table[data-level="' + (i - 1) + '"]').forEach(function (table) {
                if (Game.slots[table.getAttribute('data-slot')] === undefined && i === 0)
                        table.style.border = '1px solid yellow';

                else if (Game.slots[table.getAttribute('data-slot')] !== undefined) {
                    if (can_evolve_factory(table.getAttribute('data-slot'), i))
                        table.style.border = '1px solid yellow';
                }
            });
        }
    }

    // Robot upgrades
    document.querySelectorAll('.improvements li').forEach(function (li) {
        li.style.color = 'black';
    });

    if (can_afford_upgrade(Game.robot_level+1))
        document.querySelector('.upgrade-robot-level').style.color = 'orange';

    if (can_afford_next_robot(Game.robot_upgrade_level+1))
        document.querySelector('.upgrade-next-robot').style.color = 'orange';
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

    return Math.pow(costs['factory_'+type] * count_f, 1.1);
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

// @TODO: doc
function can_afford_next_robot(level) {
    return (Game.robot_count >= Math.pow(costs['upgrade_next_robot']*level*3, 1.3))
}

/**
 * Check if the user can upgrade a factory
 * Has the requested conditions
 *
 * @param   slot        the slot to check
 * @param   lvlRequest  the level wanted (usually slot level + 1)
 * @returns {boolean}   the decision
 */
function can_evolve_factory(slot, lvlRequest) {
    var current_level = Game.slots[slot];
    // Min robot level = 20
    if (lvlRequest === 0)
        if (!Game.robot_level > 49)
            return false;

    if (lvlRequest === 2)
        if (!Game.robot_level > 19)
            return false;

    if (lvlRequest === 3)
        if (!Game.robot_level > 39)
            return false;

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

function pay_upgrade_next_robot(request) {
    if (Math.pow(costs['upgrade_next_robot']*request*3, 1.3) <= Game.robot_count)
        Game.robot_count = Game.robot_count-Math.pow(costs['upgrade_next_robot']*request, 1.2);
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
 * for the sake of display, this function is called every 10ms
 * which means that the rps must be divided by 100
 *
 */
function auto_build() {
    Game.robot_count += parseFloat(Game.build_sec_factories/100 * (1+Game.robot_upgrade_level*0.75) * Game.robot_factor_build);
    update_clicker();
}

update_build_sec_factories(); // Init the rps
setInterval(auto_build, 10); // auto build every 10 ms
setInterval(affordable, 2000); // check affordable stuff but not every 1 ms ...


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

        var request_slot = Game.slots[number_slot]+1;

        if (can_evolve_factory(number_slot, request_slot)) {
            if (can_afford_factory(request_slot)) {
                pay_factory(request_slot); // The price of the factory depend on the slots: pay before !
                slot.setAttribute('data-level', request_slot);
                Game.slots[number_slot]++;
                update_factories();
            }
        }
   })
});

// Upgrade level robots
document.querySelector('.upgrade-robot-level').addEventListener('click', function () {
    if (can_afford_upgrade(Game.robot_level+1)) {
        pay_robot(Game.robot_level);
        Game.robot_level++;
        update_robot_details();
    }
});

// Upgrade robots
document.querySelector('.upgrade-next-robot').addEventListener('click', function () {
    if (can_afford_next_robot(Game.robot_upgrade_level+1)) {
        pay_upgrade_next_robot(Game.robot_upgrade_level + 1);
        Game.robot_upgrade_level++;
        update_robot_details();
    }
});