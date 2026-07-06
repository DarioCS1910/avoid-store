/* =======================================================
  ΛVØID — Products Catalog v3
  Exposes: window.WF_PRODUCTS
  Cada producto: { id, brand, name, price, category, img, sizes, desc }
======================================================= */

var WF_PRODUCTS = [

  /* ---- TEES ---- */
  {
    id: 'p001',
    brand: 'ΛVØID',
    name: 'ΛVØID TEE BLACK',
    price: 39.99,
    category: 'tees',
    img: 'assets/img/tee-black.jpg',
    sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Oversized heavyweight tee. 100% cotton 280gsm. Dropped shoulders.'
  },
  {
    id: 'p002',
    brand: 'ΛVØID',
    name: 'ΛVØID TEE WHITE',
    price: 39.99,
    category: 'tees',
    img: 'assets/img/tee-white.jpg',
    sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Oversized heavyweight tee. 100% cotton 280gsm. Dropped shoulders.'
  },
  {
    id: 'p003',
    brand: 'ΛVØID',
    name: 'ΛVØID TEE WASHED GREY',
    price: 44.99,
    category: 'tees',
    img: 'assets/img/tee-grey.jpg',
    sizes: ['XS','S','M','L','XL'],
    desc: 'Acid washed finish. Vintage feel. 100% cotton.'
  },
  {
    id: 'p004',
    brand: 'ΛVØID',
    name: 'ΛVØID LONGSLEEVE BLACK',
    price: 49.99,
    category: 'tees',
    img: 'assets/img/ls-black.jpg',
    sizes: ['XS','S','M','L','XL'],
    desc: 'Long sleeve heavyweight tee. Ribbed cuffs. 100% cotton.'
  },
  {
    id: 'p005',
    brand: 'ΛVØID',
    name: 'ΛVØID LONGSLEEVE WHITE',
    price: 49.99,
    category: 'tees',
    img: 'assets/img/ls-white.jpg',
    sizes: ['XS','S','M','L','XL'],
    desc: 'Long sleeve heavyweight tee. Ribbed cuffs. 100% cotton.'
  },
  {
    id: 'p006',
    brand: 'ΛVØID',
    name: 'ΛVØID THERMAL TEE BLACK',
    price: 54.99,
    category: 'tees',
    img: 'assets/img/thermal-black.jpg',
    sizes: ['S','M','L','XL'],
    desc: 'Waffle knit thermal fabric. Relaxed fit.'
  },

  /* ---- HOODIES ---- */
  {
    id: 'p007',
    brand: 'ΛVØID',
    name: 'ΛVØID HOODIE BLACK',
    price: 89.99,
    category: 'hoodies',
    img: 'assets/img/hoodie-black.jpg',
    sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Heavyweight fleece hoodie. 420gsm. Kangaroo pocket. Oversized fit.'
  },
  {
    id: 'p008',
    brand: 'ΛVØID',
    name: 'ΛVØID HOODIE WHITE',
    price: 89.99,
    category: 'hoodies',
    img: 'assets/img/hoodie-white.jpg',
    sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Heavyweight fleece hoodie. 420gsm. Kangaroo pocket. Oversized fit.'
  },
  {
    id: 'p009',
    brand: 'ΛVØID',
    name: 'ΛVØID HOODIE GREY',
    price: 89.99,
    category: 'hoodies',
    img: 'assets/img/hoodie-grey.jpg',
    sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Heavyweight fleece hoodie. 420gsm. Kangaroo pocket. Oversized fit.'
  },
  {
    id: 'p010',
    brand: 'ΛVØID',
    name: 'ΛVØID ZIP HOODIE BLACK',
    price: 99.99,
    category: 'hoodies',
    img: 'assets/img/zip-hoodie-black.jpg',
    sizes: ['S','M','L','XL','XXL'],
    desc: 'Full zip heavyweight hoodie. YKK zipper. Fleece lined.'
  },
  {
    id: 'p011',
    brand: 'ΛVØID',
    name: 'ΛVØID CREWNECK BLACK',
    price: 79.99,
    category: 'hoodies',
    img: 'assets/img/crew-black.jpg',
    sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Heavyweight fleece crewneck. 380gsm. Boxy fit.'
  },
  {
    id: 'p012',
    brand: 'ΛVØID',
    name: 'ΛVØID CREWNECK GREY',
    price: 79.99,
    category: 'hoodies',
    img: 'assets/img/crew-grey.jpg',
    sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Heavyweight fleece crewneck. 380gsm. Boxy fit.'
  },

  /* ---- PANTS ---- */
  {
    id: 'p013',
    brand: 'ΛVØID',
    name: 'ΛVØID CARGO PANTS BLACK',
    price: 109.99,
    category: 'pants',
    img: 'assets/img/cargo-black.jpg',
    sizes: ['28','30','32','34','36'],
    desc: 'Technical cargo pants. 6 pockets. Relaxed tapered fit.'
  },
  {
    id: 'p014',
    brand: 'ΛVØID',
    name: 'ΛVØID CARGO PANTS KHAKI',
    price: 109.99,
    category: 'pants',
    img: 'assets/img/cargo-khaki.jpg',
    sizes: ['28','30','32','34','36'],
    desc: 'Technical cargo pants. 6 pockets. Relaxed tapered fit.'
  },
  {
    id: 'p015',
    brand: 'ΛVØID',
    name: 'ΛVØID SWEATPANTS BLACK',
    price: 89.99,
    category: 'pants',
    img: 'assets/img/sweat-black.jpg',
    sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Heavyweight fleece sweatpants. Ribbed cuffs. Elastic waistband.'
  },
  {
    id: 'p016',
    brand: 'ΛVØID',
    name: 'ΛVØID SWEATPANTS GREY',
    price: 89.99,
    category: 'pants',
    img: 'assets/img/sweat-grey.jpg',
    sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Heavyweight fleece sweatpants. Ribbed cuffs. Elastic waistband.'
  },
  {
    id: 'p017',
    brand: 'ΛVØID',
    name: 'ΛVØID SHORTS BLACK',
    price: 59.99,
    category: 'pants',
    img: 'assets/img/shorts-black.jpg',
    sizes: ['XS','S','M','L','XL'],
    desc: 'Fleece shorts. Elastic waistband with drawstring.'
  },

  /* ---- ACCESSORIES ---- */
  {
    id: 'p018',
    brand: 'ΛVØID',
    name: 'ΛVØID CAP BLACK',
    price: 34.99,
    category: 'accessories',
    img: 'assets/img/cap-black.jpg',
    sizes: ['ONE SIZE'],
    desc: '6-panel structured cap. Embroidered logo. Adjustable strap.'
  },
  {
    id: 'p019',
    brand: 'ΛVØID',
    name: 'ΛVØID CAP WHITE',
    price: 34.99,
    category: 'accessories',
    img: 'assets/img/cap-white.jpg',
    sizes: ['ONE SIZE'],
    desc: '6-panel structured cap. Embroidered logo. Adjustable strap.'
  },
  {
    id: 'p020',
    brand: 'ΛVØID',
    name: 'ΛVØID BEANIE BLACK',
    price: 29.99,
    category: 'accessories',
    img: 'assets/img/beanie-black.jpg',
    sizes: ['ONE SIZE'],
    desc: 'Ribbed knit beanie. 100% acrylic. Embroidered patch.'
  },
  {
    id: 'p021',
    brand: 'ΛVØID',
    name: 'ΛVØID TOTE BAG BLACK',
    price: 24.99,
    category: 'accessories',
    img: 'assets/img/tote-black.jpg',
    sizes: ['ONE SIZE'],
    desc: 'Heavy canvas tote. Screen printed logo. 38x42cm.'
  },
  {
    id: 'p022',
    brand: 'ΛVØID',
    name: 'ΛVØID SOCKS BLACK (3 PACK)',
    price: 19.99,
    category: 'accessories',
    img: 'assets/img/socks-black.jpg',
    sizes: ['ONE SIZE'],
    desc: '3-pack crew socks. Cotton blend. Ribbed logo cuff.'
  },
  {
    id: 'p023',
    brand: 'ΛVØID',
    name: 'ΛVØID BUCKET HAT BLACK',
    price: 39.99,
    category: 'accessories',
    img: 'assets/img/bucket-black.jpg',
    sizes: ['S/M','L/XL'],
    desc: 'Reversible bucket hat. Embroidered logo. 100% cotton.'
  }

];

window.WF_PRODUCTS = WF_PRODUCTS;
