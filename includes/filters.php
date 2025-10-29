<?php
/**
 * Utility/filter functions for link-block-ud
 */

defined('ABSPATH') || exit;

function ud_link_block_register_filters() {
    // Attachment-Seiten nicht automatisch umleiten
    add_filter( 'redirect_canonical', function( $redirect_url, $requested_url ) {
        if ( is_attachment() ) {
            return false;
        }
        return $redirect_url;
    }, 10, 2 );

    // Nur Videos im Template einbetten, Rest "nackt" lassen
    add_filter( 'the_content', function( $content ) {
        if ( is_attachment() ) {
            $url  = wp_get_attachment_url();
            $mime = get_post_mime_type();

            if ( strpos( $mime, 'video' ) === 0 ) {
                $video = '<video controls style="max-width:100%;height:auto;">'
                       . '<source src="' . esc_url( $url ) . '" type="' . esc_attr( $mime ) . '">'
                       . '</video>';
                return $video . $content;
            } else {
                // alles außer Video → nackt öffnen
                wp_redirect( $url, 302 );
                exit;
            }
        }
        return $content;
    } );
}
add_action( 'init', 'ud_link_block_register_filters' );
