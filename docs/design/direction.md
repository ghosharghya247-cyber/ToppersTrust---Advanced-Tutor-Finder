# A good place to grow

Education marketplace for Bangladeshi families, independent tutors, and tuition partners. The primary task is finding a compatible tutor and understanding their qualifications, area, schedule, and expected monthly salary.

## Design system

- Mulberry #542D46: headings, primary actions, identity.
- Rose #F5E9ED: discovery intro and selected controls.
- Honey #E9BE67: warm invitation and secondary emphasis.
- Eucalyptus #DCE8DF: subject and guidance surfaces.
- Warm white #FFFCF9: page background; white #FFFFFF: forms and profile rows.
- Ink #302832: body copy; muted #706670; borders #E4D9DF.
- Fraunces 400–600: expressive scholarly headings; Manrope 400–800: labels, controls, reading text.
- Fluid 38–68px hero; 32–44px section titles; 24–28px profile names; 16px body; 12–14px metadata.
- Lucide outline icons, generally 18–22px, consistent 1.8–2px strokes.
- Buttons 10px radius, profile rows 16px, one arch in the hero photograph. No blanket shadows or gradients.

## Composition

Homepage: left-aligned editorial headline and search beside one candid tutoring photo; a quiet reassurance band; colored subject index; open sequential steps; mulberry tutor invitation; FAQ.

    [Brand             Navigation           Account]
    [Headline + search         Learning photograph]
    [Profile clarity | Schedule | Monthly pricing]
    [Four subject links with typographic symbols   ]
    [How it works intro        Three open steps    ]
    [Teaching invitation                  CTA      ]
    [FAQ intro                 Expandable answers ]

Discovery: generous introduction and text search, then filter rail plus horizontal profiles with a distinct price/schedule/action column. On mobile filters expand on request and rows become stacked profiles with a single clear action.

    [Discovery heading + search                    ]
    [Subject  ][Count                       Sort   ]
    [Area     ][Portrait  Name/subjects  Price/CTA  ]
    [Budget   ][       Expand teaching details     ]
    [Schedule ][Portrait  Name/subjects  Price/CTA  ]

## Review before implementation

Rejected the default cream/terracotta serif treatment and identical card grid. Retained generous whitespace but grounded the character in exercise-book subject symbols, South Asian home learning photography, and monthly pricing in taka. Trust is based on actual profile data; never invent review counts, verification, tutor photos, or success metrics. Existing authentication gates, controllers, APIs, database access and mutations remain authoritative.

The generated concepts are the implementation references. Deliberate adaptations: real data replaces sample names; initial avatars replace absent profile photos; existing workspace navigation and authentication dialogs remain necessary; subject tiles use code-native typography and icons rather than rasterized objects. No verification status is inferred.

## Generated photography

Built-in Image Gen. Prompt: candid Bangladeshi woman tutor in olive linen and teenage learner in blue, working on mathematics in a sunlit Dhaka home; natural editorial photography, no text or branding. Production asset: public/images/learning-together.webp. Concepts: home-concept.png, discovery-concept.png, lower-page-concept.png.
