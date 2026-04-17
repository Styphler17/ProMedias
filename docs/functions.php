<?php
/**
 * Twenty Twenty-Five functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */

/**
 * Register block styles.
 */
function twentytwentyfive_block_styles() {
	if ( function_exists( 'register_block_style' ) ) {
		register_block_style(
			'core/details',
			array(
				'name'  => 'arrow-right',
				'label' => __( 'Arrow right', 'twentytwentyfive' ),
			)
		);
		register_block_style(
			'core/post-terms',
			array(
				'name'  => 'pill',
				'label' => __( 'Pill', 'twentytwentyfive' ),
			)
		);
		register_block_style(
			'core/list',
			array(
				'name'  => 'check-mark',
				'label' => __( 'Check mark', 'twentytwentyfive' ),
			)
		);
		register_block_style(
			'core/navigation-link',
			array(
				'name'  => 'arrow-right',
				'label' => __( 'Arrow right', 'twentytwentyfive' ),
			)
		);
	}
}
add_action( 'init', 'twentytwentyfive_block_styles' );

/**
 * Enqueue block stylesheets.
 */
function twentytwentyfive_block_stylesheets() {
	/**
	 * The `wp_enqueue_block_style` function helps us enqueue a stylesheet
	 * for a specific block. These stylesheets are only loaded when the
	 * block is present on the page, helping with performance.
	 *
	 * @link https://developer.wordpress.org/reference/functions/wp_enqueue_block_style/
	 */
	wp_enqueue_block_style(
		'core/separator',
		array(
			'handle' => 'twentytwentyfive-separator',
			'src'    => get_parent_theme_file_uri( 'assets/css/separator.css' ),
			'ver'    => '1.0',
			'path'   => get_parent_theme_file_path( 'assets/css/separator.css' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_block_stylesheets' );

/**
 * Register pattern categories.
 */
function twentytwentyfive_pattern_categories() {
	if ( function_exists( 'register_block_pattern_category' ) ) {
		register_block_pattern_category(
			'twentytwentyfive_page',
			array(
				'label'       => _x( 'Pages', 'Pattern category title', 'twentytwentyfive' ),
				'description' => __( 'A category for full page patterns.', 'twentytwentyfive' ),
			)
		);

		register_block_pattern_category(
			'twentytwentyfive_post-format',
			array(
				'label'       => _x( 'Post formats', 'Pattern category title', 'twentytwentyfive' ),
				'description' => __( 'A category for post format patterns.', 'twentytwentyfive' ),
			)
		);
	}
}
add_action( 'init', 'twentytwentyfive_pattern_categories' );

/**
 * Register font family.
 */
if ( ! function_exists( 'twentytwentyfive_get_font_face_styles' ) ) :
	/**
	 * Get font face styles.
	 *
	 * @return string
	 */
	function twentytwentyfive_get_font_face_styles() {
		return "
		@font-face{
			font-family: 'Inter';
			src: url('" . get_parent_theme_file_uri( 'assets/fonts/inter/Inter-VariableFont_slnt,wght.woff2' ) . "') format('woff2');
			font-weight: 100 900;
			font-style: normal;
			font-display: swap;
		}
		";
	}
endif;

if ( ! function_exists( 'twentytwentyfive_enqueue_font_face_styles' ) ) :
	/**
	 * Enqueue font face styles.
	 */
	function twentytwentyfive_enqueue_font_face_styles() {
		wp_add_inline_style( 'wp-block-library', twentytwentyfive_get_font_face_styles() );
	}
endif;
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_font_face_styles' );

/**
 * Register custom post formats.
 */
function twentytwentyfive_post_formats() {
	add_theme_support( 'post-formats', array( 'aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat' ) ) ;
}
add_action( 'after_setup_theme', 'twentytwentyfive_post_formats' );

/**
 * Add custom post format icons.
 */
function twentytwentyfive_post_format_icons( $title, $post_id ) {
	$format = get_post_format( $post_id );
	if ( $format ) {
		$title = '<span class="post-format-icon post-format-' . $format . '"></span>' . $title;
	}
	return $title;
}
add_filter( 'the_title', 'twentytwentyfive_post_format_icons', 10, 2 );

/**
 * Get the post format name.
 */
if ( ! function_exists( 'twentytwentyfive_get_post_format_name' ) ) :
	/**
	 * Get the post format name.
	 *
	 * @return string
	 */
	function twentytwentyfive_get_post_format_name() {
		$post_format_slug = get_post_format();

		if ( $post_format_slug && 'standard' !== $post_format_slug ) {
			return get_post_format_string( $post_format_slug );
		}
	}
endif;

// ─────────────────────────────────────────────────────────────────────────────
// REST API — allow WooCommerce access in local dev over HTTP
// ─────────────────────────────────────────────────────────────────────────────
add_action( 'rest_api_init', function() {
    add_filter( 'woocommerce_rest_check_permissions', '__return_true' );
});

// ─────────────────────────────────────────────────────────────────────────────
// Headless mode — redirect front-end to the React dev server
// ─────────────────────────────────────────────────────────────────────────────
add_action( 'template_redirect', function() {
    if ( ! is_admin() ) {
        wp_redirect( 'http://localhost:5173', 301 );
        exit;
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Auto-create required CMS pages (runs once, skips if page exists)
// ─────────────────────────────────────────────────────────────────────────────
add_action( 'init', function() {
    $required_pages = array(
        array( 'title' => 'Accueil',   'slug' => 'accueil' ),
        array( 'title' => 'À Propos',  'slug' => 'a-propos' ),
        array( 'title' => 'Services',  'slug' => 'services' ),
        array( 'title' => 'Boutique',  'slug' => 'boutique' ),
        array( 'title' => 'Réglages',  'slug' => 'reglages' ),
    );
    foreach ( $required_pages as $p ) {
        if ( ! get_page_by_path( $p['slug'] ) ) {
            wp_insert_post( array(
                'post_title'  => $p['title'],
                'post_name'   => $p['slug'],
                'post_status' => 'publish',
                'post_type'   => 'page',
            ) );
        }
    }
}, 1 ); // priority 1 — runs before acf/init

// ─────────────────────────────────────────────────────────────────────────────
// Helper: get a page ID by slug (returns '0' if not found)
// ─────────────────────────────────────────────────────────────────────────────
function promedias_page_id( $slug ) {
    $page = get_page_by_path( $slug );
    return $page ? (string) $page->ID : '0';
}

// ─────────────────────────────────────────────────────────────────────────────
// ACF Field Groups — scoped to their specific pages
// ─────────────────────────────────────────────────────────────────────────────
add_action( 'acf/init', function() {

    // ── 1. RÉGLAGES GLOBAUX (logo + hero bg) ─────────────────────────────────
    // Frontend: Layout.tsx reads site_logo / site_logo_white
    //           Home.tsx reads home_hero_bg
    acf_add_local_field_group( array(
        'key'   => 'group_global_settings',
        'title' => '⚙️ Réglages Globaux du Site',
        'fields' => array(
            array(
                'key'           => 'field_site_logo',
                'label'         => 'Logo Principal (Navbar)',
                'name'          => 'site_logo',
                'type'          => 'image',
                'return_format' => 'url',
                'instructions'  => 'Affiché dans la barre de navigation. Fond transparent ou sombre.',
            ),
            array(
                'key'           => 'field_site_logo_white',
                'label'         => 'Logo Blanc (Footer)',
                'name'          => 'site_logo_white',
                'type'          => 'image',
                'return_format' => 'url',
                'instructions'  => 'Version blanche/inversée du logo pour le footer sombre.',
            ),
            array(
                'key'           => 'field_home_hero_bg',
                'label'         => 'Hero Background — Page d\'Accueil',
                'name'          => 'home_hero_bg',
                'type'          => 'image',
                'return_format' => 'url',
                'instructions'  => 'Image cinématique de fond pour le hero de la page d\'accueil. Recommandé : 1920×1080px minimum.',
            ),
        ),
        'location' => array( array( array(
            'param'    => 'post',
            'operator' => '==',
            'value'    => promedias_page_id( 'reglages' ),
        ) ) ),
        'show_in_rest' => true,
    ) );

    // ── 2. PAGE À PROPOS ──────────────────────────────────────────────────────
    acf_add_local_field_group( array(
        'key'   => 'group_about_page',
        'title' => '📸 Édition : Page À Propos',
        'fields' => array(
            array(
                'key'           => 'field_hero_image',
                'label'         => 'Image Hero (Technicien)',
                'name'          => 'hero_image',
                'type'          => 'image',
                'return_format' => 'url',
                'instructions'  => 'Photo du technicien affichée dans le hero de la page À Propos.',
            ),
            array(
                'key'           => 'field_impact_image',
                'label'         => 'Image Impact Écologique',
                'name'          => 'environmental_impact_image',
                'type'          => 'image',
                'return_format' => 'url',
            ),
            array(
                'key'           => 'field_team_1',
                'label'         => 'Expert 1 — iPhone',
                'name'          => 'team_1',
                'type'          => 'image',
                'return_format' => 'url',
            ),
            array(
                'key'           => 'field_team_2',
                'label'         => 'Expert 2 — Mac',
                'name'          => 'team_2',
                'type'          => 'image',
                'return_format' => 'url',
            ),
            array(
                'key'           => 'field_team_3',
                'label'         => 'Expert 3 — Micro-Soudure',
                'name'          => 'team_3',
                'type'          => 'image',
                'return_format' => 'url',
            ),
            array(
                'key'           => 'field_team_4',
                'label'         => 'Expert 4 — Diagnostic',
                'name'          => 'team_4',
                'type'          => 'image',
                'return_format' => 'url',
            ),
            array(
                'key'           => 'field_store_image',
                'label'         => 'Image de la Boutique',
                'name'          => 'boutique_storefront_image',
                'type'          => 'image',
                'return_format' => 'url',
            ),
        ),
        'location' => array( array( array(
            'param'    => 'post',
            'operator' => '==',
            'value'    => promedias_page_id( 'a-propos' ),
        ) ) ),
        'show_in_rest' => true,
    ) );

    // ── 3. CONSOLE BOUTIQUE — descriptions par catégorie ─────────────────────
    acf_add_local_field_group( array(
        'key'   => 'group_shop_dashboard',
        'title' => '🛍️ Console : Descriptions de la Boutique',
        'fields' => array(
            array(
                'key'          => 'field_shop_desc_all',
                'label'        => 'Description — Tous les produits',
                'name'         => 'desc_tous',
                'type'         => 'textarea',
                'instructions' => 'Texte affiché quand aucun filtre n\'est actif.',
            ),
            array(
                'key'   => 'field_shop_desc_tel',
                'label' => 'Description — Téléphonie',
                'name'  => 'desc_telephonie',
                'type'  => 'textarea',
            ),
            array(
                'key'   => 'field_shop_desc_info',
                'label' => 'Description — Informatique',
                'name'  => 'desc_informatique',
                'type'  => 'textarea',
            ),
            array(
                'key'   => 'field_shop_desc_acc',
                'label' => 'Description — Accessoires',
                'name'  => 'desc_accessoires',
                'type'  => 'textarea',
            ),
        ),
        'location' => array( array( array(
            'param'    => 'post',
            'operator' => '==',
            'value'    => promedias_page_id( 'boutique' ),
        ) ) ),
        'show_in_rest' => true,
    ) );

} );
