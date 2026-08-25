/**
 * Locale-independent site constants.
 *
 * Deliberately free of imports: this module is reached from client components,
 * so pulling in the environment schema here would ship the validation library
 * to every route.
 */
export const siteConfig = {
  name: "Amin Khoddam",
} as const;

/**
 * Portfolio sections, in the order they appear on the page. The id doubles as
 * the anchor target and as the translation key under `nav`.
 */
export const portfolioSections = ["about", "skills", "experience", "projects", "contact"] as const;
