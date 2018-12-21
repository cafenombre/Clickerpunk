<?php
/**
 * Created by PhpStorm.
 * User: uderline
 * Date: 12/20/18
 * Time: 5:43 PM
 */

?>

<?php require 'common/head.php'; ?>

<header>
    <div class="main-click">
        <p>click</p>
    </div>
</header>

<div class="block-sections">

<section class="section-robot-count">
    <div class="robot-count">
        <p class="robot-count-content" data-count="0">0</p>
    </div>
</section>


<section class="section-town">
    <div class="town">
        <?php
        for ($i=1; $i<100; $i++) {
            ?>
            <table class="slot slot_<?php echo $i; ?>" data-used="<?php echo ($i < 3) ? 1:0; ?>" data-slot="slot_<?php echo $i; ?>" data-level="<?php echo ($i > 1) ? -1:1; ?>">
                <tr><td class="slot_cell_3"></td><td class="slot_cell_3"></td><td class="slot_cell_3"></td><td class="slot_cell_3"></td><td class="slot_cell_3"></td><td class="slot_cell_3"></td>
                <tr><td class="slot_cell_3"></td><td class="slot_cell_2"></td><td class="slot_cell_2"></td><td class="slot_cell_2"></td><td class="slot_cell_2"></td><td class="slot_cell_3"></td>
                <tr><td class="slot_cell_3"></td><td class="slot_cell_2"></td><td class="slot_cell_1"></td><td class="slot_cell_1"></td><td class="slot_cell_2"></td><td class="slot_cell_3"></td>
                <tr><td class="slot_cell_3"></td><td class="slot_cell_2"></td><td class="slot_cell_1"></td><td class="slot_cell_1"></td><td class="slot_cell_2"></td><td class="slot_cell_3"></td>
                <tr><td class="slot_cell_3"></td><td class="slot_cell_2"></td><td class="slot_cell_2"></td><td class="slot_cell_2"></td><td class="slot_cell_2"></td><td class="slot_cell_3"></td>
                <tr><td class="slot_cell_3"></td><td class="slot_cell_3"></td><td class="slot_cell_3"></td><td class="slot_cell_3"></td><td class="slot_cell_3"></td><td class="slot_cell_3"></td>
            </table>
            <?php
        }
        ?>

    </div>
</section>

<section class="section-options">
    <div class="robot-definition">
        <p>Robot level: <span class="robot-level-content">1</span></p>
        <p>Robot type: <span class="robot-type-content">1</span></p>
    </div>
    <div class="improvements">
        <ul>
            <li class="upgrade-robot-level">Upgrade robot level</li>
            <li class="upgrade-next-robot">Upgrade to next robot</li>
        </ul>
    </div>
</section>
</div>
<script type="application/javascript" src="/Clickerpunk/web/js/game.js"></script>

<?php require 'common/foot.php'; ?>
