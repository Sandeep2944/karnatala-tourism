const imagePaths = [
  "img/a.jpg",
  "img/kalasa.jpg",
  "img/horanadu.jpg",
  "img/background.jpg",
  "img/baba_budan_giri.jpg",
  "img/b.jpg",
  "img/vidhansoudha.jpg",
  "img/vidhana.jpg",
  "img/tiger.png",
  "img/sringeri.jpg",
  "img/sirimane_falls.jpg",
  "img/premium.jpg",
  "img/pexels.jpg",
  "img/pattadakallu.jpg",
  "img/pattadakal-monuments-172207_1920.jpg",
  "img/palace.jpg",
  "img/mang.jpg",
  "img/mullayanagiri.jpg",
  "img/ahampi/kade_kaalu_ganesha.jpg",
  "img/kudremukh.jpg",
  "img/kambala-race-2801245_1920.jpg",
  "img/mountain.jpg",
  "img/ahampi/achyutaraya_temple.jpg",
  "img/ahampi/hemakuta_temple.jpg",
  "img/mysorepalace.jpg",
  "img/ahampi/stone_chariot.jpg",
  "img/ahampi/mathanga_hill.jpg",
  "img/ahampi/vijaya_vittala_temple.jpg",
  "img/dandeli-1641090_1920.jpg",
  "img/d.jpg",
  "img/coorg.jpg",
  "img/c.jpg",
  "img/hampiutsav.jpg",
  "img/hebbefalls.jpg",
  "img/devotional.jpg",
  "img/e.jpg",
  "img/ashiv/kavale_dhurga_fort.jpg",
  "img/ashiv/jog_falls.jpg",
  "img/ashiv/brp.jpg",
  "img/ashiv/kundadri_hill.jpg",
  "img/ashiv/kodachadri.jpg",
  "img/ashiv/sakrebailu.jpg",
  "img/auttar/st.estevam.jpg",
  "img/auttar/nrupatunga_hill.jpg",
  "img/auttar/kailasa_mantapa.jpg",
  "img/auttar/indira_gandhi_glass_house.jpg",
  "img/auttar/chitradurga.jpg",
  "img/auttar/belagam_fort.jpg",
  "img/New folder/2c9ee0f18bf131de22f1759f26d2158a.jpg",
  "img/New folder/18aa6a265bfacc284c6fc12060554b96.jpg",
  "img/New folder/04b4f4e42a5875e4bda4d031fd4b02d2.jpg",
  "img/New folder/46223a087fae2bb47c319f5ab7cdf7f4.jpg",
  "img/New folder/3c3e020996b535f46d18377f5c10644e.jpg",
  "img/New folder/4c1a209edd4cabd0597a0a729adddb72.jpg",
  "img/home/vidhansoudha.jpg",
  "img/home/pattadakalmonuments.jpg",
  "img/home/pattadakallu.jpg",
  "img/home/pattadakal-monuments.jpg",
  "img/home/palace.jpg",
  "img/home/mountain.jpg",
  "img/New folder/bg4.jpg",
  "img/New folder/bg3.jpg",
  "img/New folder/bg2.jpg",
  "img/New folder/bg.jpg",
  "img/New folder/belur.jpg",
  "img/New folder/banglorepalace.jpg",
  "img/New folder/backfix.jpg",
  "img/New folder/back1.jpg",
  "img/New folder/back.jpg",
  "img/New folder/ba799ef28a31352118c96dfc03870892.jpg",
  "img/New folder/96dcc44a3168b0327c3cd1c6fbc77216.jpg",
  "img/New folder/91f1e197c931fa8606544ef9320bb863.jpg",
  "img/New folder/58de5f2652f23cf6202f4e6b9711b152.jpg",
  "img/New folder/583e9206c54701e41da376b9e1132f01.jpg",
  "img/New folder/gokarna-om-beach.jpg",
  "img/New folder/fort.jpg",
  "img/New folder/d9d956fd9bff1b4c74948d8db04a0fe0.jpg",
  "img/New folder/d0bc4cf1437528603159ce068990dcb4.jpg",
  "img/New folder/cubbon park.jpg",
  "img/New folder/coorg.jpg",
  "img/New folder/coorg-hils.jpg",
  "img/amang/bekal_fort_beach.jpg",
  "img/New folder/hampi2.jpeg",
  "img/New folder/hampi.jpg",
  "img/New folder/hampi (2).jpg",
  "img/New folder/gulbarga.jpg",
  "img/New folder/lalbagh.jpg",
  "img/New folder/jog.jpg",
  "img/New folder/iskon.jpg",
  "img/New folder/lumbini garden2.jpg",
  "img/New folder/malpe sunset.jpg",
  "img/amang/panambur_beach.jpg",
  "img/amang/murdeshvar_temple.jpg",
  "img/amang/malpe__beach.jpg",
  "img/amang/kadri_manjunath_temple.png",
  "img/amang/gokarna_temple.jpg",
  "img/New folder/mysorepalace1.jpg",
  "img/New folder/mysorepalace.jpg",
  "img/New folder/mysore-palace2.jpg",
  "img/New folder/murdeshwara.jpg",
  "img/New folder/mangalore-island.jpg",
  "img/New folder/mang.jpg",
  "img/New folder/ulsoor-lake-banglore.jpg",
  "img/New folder/ub city (2).jpg",
  "img/New folder/sringeri.jpg",
  "img/New folder/vidhana.jpg",
  "img/New folder/vidhana soudha.jpg",
  "img/New folder/wonderla.jpg",
  "img/amadikeri/bisle_ghat.jpg",
  "img/amadikeri/bhagamandala.jpg",
  "img/amadikeri/abbey_falls.jpg",
  "img/amadikeri/madikeri-fort.jpg",
  "img/amadikeri/TalaCauvery.jpg",
  "img/amadikeri/kushal_nagar_golden_temple.jpg"
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("galleryGrid");
  if (!grid) {
    return;
  }

  imagePaths.forEach((path, index) => {
    const card = document.createElement("div");
    card.className = "gallery-card";

    const wrap = document.createElement("div");
    wrap.className = "image-wrap";

    const badge = document.createElement("span");
    badge.className = "badge-tag";
    badge.textContent = `#${index + 1}`;

    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = encodeURI(path);
    img.alt = path.split("/").pop();

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = path;

    wrap.appendChild(badge);
    wrap.appendChild(img);
    card.appendChild(wrap);
    card.appendChild(caption);
    grid.appendChild(card);
  });
});
