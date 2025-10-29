<?php
/**
 * Plugin Name:     UD Block: Erweiterter Link
 * Description:     Block für interne, externe und Medien-Links (z. B. PDF, ZIP, Video). Unterstützt Anzeigetext, Beschreibung, automatische Icons und Tagging – ideal in Kombination mit dem Filter-Container.
 * Version:         1.0.0
 * Author:          ulrich.digital gmbh
 * Author URI:      https://ulrich.digital/
 * License:         GPL v2 or later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     link-block-ud
 */


defined('ABSPATH') || exit;

// Aktivierung blockieren, falls ud-shared-api nicht aktiv ist
register_activation_hook(__FILE__, 'link_block_ud_activate');

function link_block_ud_activate() {
    include_once(ABSPATH . 'wp-admin/includes/plugin.php');

    if (!is_plugin_active('ud-shared-api/ud-shared-api.php')) {
        wp_die(
            __('Aktivierung fehlgeschlagen: Das Plugin "Link-Block" benötigt "ud-shared-api". Bitte aktiviere zuerst "ud-shared-api".', 'link-block-ud'),
            __('Plugin-Aktivierung abgebrochen', 'link-block-ud'),
            ['back_link' => true]
        );
    }
}

// Laufzeitprüfung: Falls ud-shared-api deaktiviert wurde, Hinweis ausgeben & Plugin nicht laden
include_once(ABSPATH . 'wp-admin/includes/plugin.php');

if (!is_plugin_active('ud-shared-api/ud-shared-api.php')) {
    add_action('admin_notices', function () {
        echo '<div class="notice notice-error"><p>';
        echo esc_html__('Das Plugin "Link-Block" benötigt das Plugin "ud-shared-api", um korrekt zu funktionieren. Bitte aktiviere es zuerst.', 'link-block-ud');
        echo '</p></div>';
    });
    return;
}

// Plugin-Funktionalitäten laden
foreach ([
    'helpers.php',
    // 'api.php',
    // 'render.php',
    'block-register.php',
    'enqueue.php',
    'filters.php'
] as $file) {
    require_once __DIR__ . '/includes/' . $file;
}

// Direktlink zur Einstellungsseite im Plugin-Menü
/*
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
    $url = admin_url('options-general.php?page=cpm_settings');
    $settings_link = '<a href="' . esc_url($url) . '">Einstellungen</a>';
    array_unshift($links, $settings_link);
    return $links;
});
*/
