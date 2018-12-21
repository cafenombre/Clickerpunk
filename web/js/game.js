var Game = {};
Game.robot_count = 0;
Game.robot_factor_build = 1;
Game.build_sec_factories = 1;
Game.slots = {"slot_1": 1};
Game.number_factories = 100;
Game.robot_level = 1;
var robot_count_block = document.querySelector('.robot-count-content');
var costs = {"factory_0": 10000, "factory_1": 100, "factory_2": 500, "factory_3": 5000, "upgrade_robot": 10};

// Number of robots per factory level
var factor_factory_level = {"factory_-1": 0, "factory_0": 0, "factory_1": 1, "factory_2": 5, "factory_3": 10};

function update_build_sec_factories() {
    var persec = 0;
    for (var slot in Game.slots) {
        persec += factor_factory_level["factory_" + Game.slots[slot]] * Game.robot_level;
    }
    Game.build_sec_factories = persec;
}

function update_clicker() {
    robot_count_block.innerHTML = String(Math.round(parseFloat(Game.robot_count)));
}

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

function update_robot_details() {
    document.querySelector('.robot-level-content').innerHTML = Game.robot_level;
}

// type must be int (0 for factory_0, 1 for factory_1 ...)
function price_factory(type) {
    var count_f = 0;

    for (s in Game.slots)
        if (Game.slots[s] >= type)
            count_f++;

    count_f = (count_f === 0) ? 1:count_f;

    return costs['factory_'+type] * count_f;
}

function can_afford_factory(request) {
    return (Game.robot_count >= price_factory(request));
}

function can_afford_upgrade(level) {
    return (Game.robot_count >= costs['upgrade_robot']*level*0.8)
}

function can_evolve_factory(slot, lvlRequest) {
    var current_level = Game.slots[slot];
    return (lvlRequest > current_level && lvlRequest - current_level === 1);
}

function pay_factory(request) {
    if (price_factory(request) <= Game.robot_count)
        Game.robot_count = Game.robot_count-price_factory(request);
    update_clicker();
    affordable();
}

function pay_robot(level) {
    if (costs['upgrade_robot']*level*0.8 <= Game.robot_count)
        Game.robot_count = Game.robot_count-costs['upgrade_robot']*level*0.8;
    update_clicker();
    affordable();
}

function affordable() {
    // Slots
    document.querySelectorAll('.town table').forEach(function (table) {
        table.style.border = '1px solid #ccc';
    });
    for (var i=0; i<3; i++) {
        if (Game.robot_count >= price_factory(i))
            document.querySelectorAll('.town table[data-level="'+(i-1)+'"]').forEach(function (table) {
                table.style.border = '1px solid yellow';
            });
    }
}

// AUTO BUILD
function auto_build() {
    Game.robot_count += parseFloat(Game.build_sec_factories/10 * Game.robot_factor_build);
    update_clicker();
}

update_build_sec_factories();
setInterval(auto_build, 100);
setInterval(affordable, 2000);


// EVENTS
document.querySelector('.main-click').addEventListener('click', function () {
    Game.robot_count = Game.robot_count + Game.robot_level;
    update_clicker();
});

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

document.querySelector('.upgrade-robot-level').addEventListener('click', function () {
    console.log(can_afford_upgrade(Game.robot_level+1));
    if (can_afford_upgrade(Game.robot_level+1)) {
        Game.robot_level++;
        pay_robot(Game.robot_level);
        update_robot_details();
    }
});