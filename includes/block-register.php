<?php
/**
 * Register the custom block
 */

defined('ABSPATH') || exit;

function ud_link_block_register_block() {
    register_block_type_from_metadata(__DIR__ . '/../');
}
add_action('init', 'ud_link_block_register_block');




/*
register_block_style(
    'ud/linklist-block',
    [
        'name'  => 'list',
        'label' => 'Liste',
    ]
);

register_block_style(
    'ud/linklist-block',
    [
        'name'  => 'chips',
        'label' => 'Chips',
    ]
);
*/