# -*- coding: utf-8 -*-
"""Parametric architectural artwork.

Flat, layered vector scenes in the Krain palette. They stand in for the client's
photography: intentional-looking, weightless (no image requests) and swapped out
one-for-one when real project photos arrive (see TODO-CLIENT.md).
"""
W, H = 800, 500

PALETTES = {
    "dusk":   dict(sky1="#171d26", sky2="#3a3038", sky3="#8f4c3b", glow="#ef9553",
                   far="#242b36", near="#171d26", ground="#10151c", haze="#c8703f",
                   wall="#2c3543", wall2="#3d4857", roof="#151b24", win="#ffce85", trim="#ce1b24"),
    "day":    dict(sky1="#52789b", sky2="#8fadc4", sky3="#d3e0e9", glow="#ffffff",
                   far="#39506a", near="#22303f", ground="#1a2733", haze="#bcd2e0",
                   wall="#f3f5f7", wall2="#dbe2e8", roof="#232c36", win="#2c3a48", trim="#ce1b24"),
    "golden": dict(sky1="#241c14", sky2="#734828", sky3="#d68a42", glow="#ffd07a",
                   far="#2e251b", near="#1d170f", ground="#141009", haze="#e0913f",
                   wall="#3f3122", wall2="#54412c", roof="#191308", win="#ffdf9e", trim="#ce1b24"),
    "steel":  dict(sky1="#111721", sky2="#22303f", sky3="#4a6382", glow="#c3dcf2",
                   far="#1a232f", near="#111721", ground="#0c1118", haze="#7898b8",
                   wall="#26313f", wall2="#374556", roof="#0f151d", win="#d8ecff", trim="#ce1b24"),
    "timber": dict(sky1="#1c1a17", sky2="#4d3b2c", sky3="#a9744a", glow="#ffc27a",
                   far="#2b241c", near="#1a1611", ground="#12100b", haze="#c98d4f",
                   wall="#5a4127", wall2="#75552f", roof="#1d1610", win="#ffdca0", trim="#ce1b24"),
}
ORDER = ["dusk", "day", "golden", "steel"]
LOG_ORDER = ["timber", "day", "golden", "dusk"]


def _defs(uid, p):
    return (f'<defs><linearGradient id="sky{uid}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{p["sky1"]}"/><stop offset=".55" stop-color="{p["sky2"]}"/>'
            f'<stop offset="1" stop-color="{p["sky3"]}"/></linearGradient>'
            f'<radialGradient id="glow{uid}" cx=".5" cy=".5" r=".5">'
            f'<stop offset="0" stop-color="{p["glow"]}" stop-opacity=".95"/>'
            f'<stop offset="1" stop-color="{p["glow"]}" stop-opacity="0"/></radialGradient></defs>')


def _sky(uid, p, sun_x=610, sun_y=150):
    return (f'<rect width="{W}" height="{H}" fill="url(#sky{uid})"/>'
            f'<circle cx="{sun_x}" cy="{sun_y}" r="190" fill="url(#glow{uid})"/>'
            f'<circle cx="{sun_x}" cy="{sun_y}" r="34" fill="{p["glow"]}" opacity=".92"/>')


def _hills(p):
    return (f'<path d="M0 330 L120 288 210 312 330 262 430 300 540 268 660 300 800 264 800 500 0 500Z" fill="{p["far"]}"/>'
            f'<path d="M0 372 L110 350 230 368 360 336 470 360 600 340 720 362 800 348 800 500 0 500Z" fill="{p["near"]}"/>')


def _ground(p, y=420):
    return f'<rect x="0" y="{y}" width="{W}" height="{H-y}" fill="{p["ground"]}"/>'


def _haze(uid, p):
    return (f'<defs><linearGradient id="hz{uid}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{p["haze"]}" stop-opacity="0"/>'
            f'<stop offset="1" stop-color="{p["haze"]}" stop-opacity=".38"/></linearGradient></defs>'
            f'<rect x="0" y="300" width="{W}" height="128" fill="url(#hz{uid})"/>')


def _tree(x, y, s, c):
    return (f'<g transform="translate({x} {y}) scale({s})" fill="{c}">'
            f'<rect x="-3" y="-14" width="6" height="20"/>'
            f'<path d="M0 -96 26 -46 12 -46 34 -8 -34 -8 -12 -46 -26 -46Z"/></g>')


def _win(x, y, w, h, p, lit=True, r=1.5):
    f = p["win"] if lit else p["wall2"]
    o = ".92" if lit else ".7"
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{f}" opacity="{o}"/>'


# ------------------------------------------------------------------ STRUCTURES
def _custom(p):
    s = f'<path d="M198 300 400 186 602 300 602 424 198 424Z" fill="{p["wall"]}"/>'
    s += f'<path d="M176 306 400 176 624 306 400 216Z" fill="{p["roof"]}"/>'
    s += f'<rect x="602" y="336" width="128" height="88" fill="{p["wall2"]}"/>'
    s += f'<path d="M588 342 666 300 744 342Z" fill="{p["roof"]}"/>'
    s += f'<rect x="624" y="364" width="84" height="60" rx="2" fill="{p["roof"]}"/>'
    s += f'<rect x="624" y="364" width="84" height="4" fill="{p["trim"]}"/>'
    for i in range(3):
        s += _win(248 + i * 108, 246, 44, 40, p)
    for i in range(3):
        s += _win(248 + i * 108, 330, 44, 54, p, lit=(i != 1))
    s += f'<rect x="378" y="336" width="44" height="88" rx="2" fill="{p["trim"]}"/>'
    s += f'<rect x="352" y="424" width="96" height="7" fill="{p["roof"]}"/>'
    s += f'<rect x="470" y="150" width="26" height="58" fill="{p["wall2"]}"/>'
    return s


def _log(p):
    s = f'<path d="M212 316 400 178 588 316 588 424 212 424Z" fill="{p["wall"]}"/>'
    for i in range(7):
        y = 330 + i * 14
        s += f'<line x1="216" y1="{y}" x2="584" y2="{y}" stroke="{p["wall2"]}" stroke-width="4" opacity=".85"/>'
    for i in range(6):
        y = 232 + i * 15
        half = (y - 178) * 188 / 138
        s += f'<line x1="{400-half:.0f}" y1="{y}" x2="{400+half:.0f}" y2="{y}" stroke="{p["wall2"]}" stroke-width="4" opacity=".8"/>'
    s += f'<path d="M186 322 400 166 614 322 400 200Z" fill="{p["roof"]}"/>'
    s += f'<path d="M296 424 296 350 400 288 504 350 504 424Z" fill="{p["roof"]}" opacity=".35"/>'
    for x in (300, 366, 434, 500):
        s += f'<rect x="{x-6}" y="352" width="12" height="72" fill="{p["roof"]}"/>'
    s += f'<path d="M280 356 400 286 520 356" fill="none" stroke="{p["roof"]}" stroke-width="10"/>'
    s += _win(336, 236, 128, 46, p)
    s += f'<rect x="398" y="236" width="4" height="46" fill="{p["roof"]}"/>'
    s += _win(258, 358, 46, 52, p) + _win(496, 358, 46, 52, p)
    s += f'<rect x="378" y="358" width="44" height="66" rx="2" fill="{p["trim"]}"/>'
    s += f'<rect x="516" y="150" width="30" height="70" fill="{p["wall2"]}"/><rect x="510" y="144" width="42" height="10" fill="{p["roof"]}"/>'
    return s


def _addition(p):
    s = f'<path d="M132 306 300 200 468 306 468 424 132 424Z" fill="{p["wall"]}"/>'
    s += f'<path d="M112 312 300 190 488 312 300 226Z" fill="{p["roof"]}"/>'
    s += _win(178, 254, 40, 36, p, lit=False) + _win(262, 254, 40, 36, p, lit=False) + _win(346, 254, 40, 36, p, lit=False)
    s += _win(178, 336, 40, 50, p, lit=False)
    s += f'<rect x="274" y="336" width="42" height="88" rx="2" fill="{p["wall2"]}"/>'
    # new wing — outlined in brand red to read as "the addition"
    s += f'<path d="M468 336 570 262 672 336 672 424 468 424Z" fill="{p["wall2"]}"/>'
    s += f'<path d="M452 342 570 254 688 342 570 288Z" fill="{p["roof"]}"/>'
    s += f'<path d="M468 336 570 262 672 336 672 424 468 424" fill="none" stroke="{p["trim"]}" stroke-width="3.5" stroke-linejoin="round"/>'
    s += _win(506, 356, 50, 56, p) + _win(586, 356, 50, 56, p)
    s += f'<rect x="452" y="330" width="4" height="94" fill="{p["trim"]}" opacity=".55"/>'
    return s


def _garage(p):
    s = f'<path d="M160 320 400 192 640 320 640 424 160 424Z" fill="{p["wall"]}"/>'
    s += f'<path d="M138 328 400 182 662 328 400 216Z" fill="{p["roof"]}"/>'
    for i in range(2):
        x = 222 + i * 196
        s += f'<rect x="{x}" y="330" width="156" height="94" rx="2" fill="{p["wall2"]}"/>'
        for j in range(4):
            s += f'<line x1="{x+6}" y1="{344+j*22}" x2="{x+150}" y2="{344+j*22}" stroke="{p["roof"]}" stroke-width="3"/>'
        s += f'<rect x="{x}" y="330" width="156" height="5" fill="{p["trim"]}"/>'
    s += _win(370, 244, 60, 40, p)
    s += f'<rect x="382" y="150" width="36" height="42" fill="{p["wall2"]}"/>'
    s += f'<path d="M370 154 400 128 430 154Z" fill="{p["roof"]}"/>'
    s += f'<rect x="396" y="112" width="8" height="18" fill="{p["trim"]}"/>'
    s += f'<rect x="140" y="418" width="520" height="8" fill="{p["roof"]}"/>'
    return s


def _deck(p):
    s = f'<rect x="24" y="196" width="272" height="228" fill="{p["wall"]}"/>'
    s += f'<path d="M2 204 160 104 318 204 160 136Z" fill="{p["roof"]}"/>'
    s += _win(58, 232, 62, 52, p) + _win(158, 232, 62, 52, p)
    s += f'<rect x="58" y="316" width="62" height="52" rx="2" fill="{p["wall2"]}"/>'
    s += f'<rect x="176" y="308" width="56" height="94" rx="2" fill="{p["trim"]}"/>'
    # deck platform
    s += f'<rect x="252" y="352" width="470" height="14" fill="{p["wall2"]}"/>'
    for i in range(11):
        s += f'<rect x="{258+i*42}" y="366" width="12" height="{58 if i%2 else 46}" fill="{p["roof"]}"/>'
    s += f'<rect x="252" y="342" width="470" height="12" fill="{p["roof"]}" opacity=".7"/>'
    # rail
    s += f'<rect x="252" y="272" width="470" height="9" fill="{p["wall2"]}"/>'
    for i in range(24):
        s += f'<rect x="{262+i*19}" y="281" width="4" height="62" fill="{p["wall2"]}" opacity=".8"/>'
    for x in (252, 480, 713):
        s += f'<rect x="{x}" y="262" width="13" height="98" fill="{p["roof"]}"/>'
        s += f'<rect x="{x-3}" y="256" width="19" height="8" fill="{p["trim"]}"/>'
    # pergola
    s += f'<rect x="470" y="150" width="14" height="118" fill="{p["roof"]}"/><rect x="700" y="150" width="14" height="118" fill="{p["roof"]}"/>'
    s += f'<rect x="452" y="142" width="280" height="12" fill="{p["roof"]}"/>'
    for i in range(8):
        s += f'<rect x="{466+i*34}" y="122" width="9" height="24" fill="{p["roof"]}" opacity=".85"/>'
    s += f'<rect x="252" y="424" width="470" height="6" fill="{p["ground"]}"/>'
    return s


def _roofplane(p):
    s = f'<path d="M60 430 400 168 740 430Z" fill="{p["roof"]}"/>'
    for i in range(11):
        y = 200 + i * 22
        half = (y - 168) * 340 / 262
        s += f'<line x1="{400-half:.0f}" y1="{y}" x2="{400+half:.0f}" y2="{y}" stroke="{p["wall2"]}" stroke-width="3.5" opacity=".7"/>'
    s += f'<path d="M60 430 400 168 740 430" fill="none" stroke="{p["trim"]}" stroke-width="4" stroke-linejoin="round"/>'
    # dormer
    s += f'<path d="M292 372 360 300 428 372Z" fill="{p["wall"]}"/>'
    s += f'<path d="M280 378 360 292 440 378 360 316Z" fill="{p["roof"]}"/>'
    s += _win(336, 330, 48, 42, p)
    # ridge vent + chimney
    s += f'<rect x="392" y="160" width="16" height="14" fill="{p["trim"]}"/>'
    s += f'<rect x="548" y="238" width="46" height="94" fill="{p["wall2"]}"/><rect x="540" y="230" width="62" height="12" fill="{p["roof"]}"/>'
    s += f'<rect x="60" y="428" width="680" height="10" fill="{p["wall2"]}"/>'
    return s


KINDS = {"custom": _custom, "log": _log, "addition": _addition,
         "garage": _garage, "deck": _deck, "roof": _roofplane}


def scene(kind, variant=0, cls="", label=""):
    """Return an inline SVG scene. `variant` cycles the palette."""
    order = LOG_ORDER if kind == "log" else ORDER
    p = PALETTES[order[variant % len(order)]]
    uid = f"{kind}{variant}"
    c = f' class="{cls}"' if cls else ""
    aria = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    body = (_defs(uid, p) + _sky(uid, p, 610 if variant % 2 else 200, 140 + (variant % 3) * 22)
            + _hills(p) + _haze(uid, p) + _ground(p) + KINDS[kind](p))
    body += (_tree(84, 424, 1.05, p["ground"]) + _tree(742, 424, .85, p["ground"])
             + _tree(46, 430, .7, p["ground"]) + _tree(772, 428, 1.15, p["ground"]))
    body += f'<rect x="0" y="{H-10}" width="{W}" height="10" fill="{p["trim"]}" opacity=".85"/>'
    return (f'<svg{c} viewBox="0 0 {W} {H}" {aria} preserveAspectRatio="xMidYMid slice" '
            f'xmlns="http://www.w3.org/2000/svg">{body}</svg>')


SERVICE_ART = {
    "custom-home-building": ("custom", 0),
    "log-homes": ("log", 2),
    "home-additions": ("addition", 1),
    "garages-outbuildings": ("garage", 3),
    "decks-outdoor-living": ("deck", 0),
    "roofing-exteriors": ("roof", 2),
}

GALLERY_ART = {
    "art-timber": ("log", 0), "art-custom": ("custom", 3), "art-addition": ("addition", 2),
    "art-garage": ("garage", 0), "art-deck": ("deck", 1), "art-roof": ("roof", 3),
    "art-log": ("log", 1), "art-suite": ("addition", 0), "art-barn": ("garage", 2),
    "art-porch": ("deck", 3), "art-siding": ("roof", 1), "art-acreage": ("custom", 1),
}
