export const SITE = {
  nombre:          'A Tu Medida',
  tagline:         'Materializamos tus ideas.',
  descripcion:     'Diseñadora de modas. Prendas 100% a la medida.',
  eyebrow:         'Diseñadora de modas',
  whatsappNum:     '50240862009',
  whatsappDisplay: '+502 4086-2009',
  whatsappMsg:     'Hola, me gustaría consultar sobre una prenda a la medida.',
  instagram:       '',
  facebook:        '',
  tiktok:          '',
} as const;

export const WHATSAPP_URL =
  `https://wa.me/${SITE.whatsappNum}?text=${encodeURIComponent(SITE.whatsappMsg)}`;
