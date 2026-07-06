# Design

## Intent

Build a one-page Havilands Tea Room website using the supplied inn reference as the visual model: a pale fixed masthead, full-bleed storefront hero photography, large serif hospitality type, crisp buttons, and a slim practical information strip at the bottom of the first viewport.

## Information Sources

- Facebook public page: Havilands Tea Room page identity.
- GoToEat listing: address, telephone, tea-house category, service options, amenities, opening-hours listing, and public photo set.
- GoToEat menu page: hot drinks, pots of tea, breakfast, afternoon tea, sandwiches, toasties, paninis, jacket potatoes, light lunches, fresh bakes, and selected listed prices.

## Visual Direction

The page should feel like a British tea room rather than a generic cafe. The main signal is the storefront photo, with warm-dark image overlay, pale navigation, serif title, and a restrained sage, rose, and cream palette drawn from the Havilands sign and tea-room photos.

## Layout

- Fixed masthead with brand, address note, section links, and phone number.
- Full-viewport hero using the real exterior photo, with direct call and menu actions.
- Bottom hero strip for call, address, menu summary, and opening note.
- Intro section pairing copy with the outdoor seating and Alice-inspired decor photo.
- Menu section with one large featured image panel and a structured list of categories.
- Gallery section with real teapot, soup, toastie, and cream-tea imagery.
- Visit section with embedded Google map and a practical essentials panel.
- Hours section with the public daily hours and a phone-confirmation note.

## Motion

GSAP is used only for hierarchy and feedback:

- Hero image and text enter as one coordinated scene.
- Sections reveal once through IntersectionObserver.
- Buttons receive subtle pointer feedback on fine-pointer devices.
- Cards lift gently on hover.
- `prefers-reduced-motion` reveals all content immediately and disables motion.

## Responsive Rules

- Desktop keeps the reference-style hero, bottom strip, and asymmetric image-led sections.
- Tablet collapses the content grids into single columns.
- Mobile keeps the hero readable over the storefront photo, stacks CTAs, and turns the bottom hero strip into a compact scrollable information block.

## Pre-flight Notes

- No fake reviews or unsupported claims were added.
- Real local images are used throughout.
- The palette uses sage green, rose, cream, and deep ink rather than a one-note beige theme.
- Opening times are presented as public listing data with a call-ahead note.
