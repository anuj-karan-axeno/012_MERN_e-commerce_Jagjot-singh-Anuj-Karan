import 'dotenv/config';
import mongoose from 'mongoose';
import { productModel } from './src/models/product.schema.js';
import { categoryModel } from './src/models/category.schema.js';

const IMAGES = [
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788988751/image_8.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788988751/image_7.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788988750/Frame_34.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788988750/image_9.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788988750/Frame_32.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788988750/image_10.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788988750/Frame_33.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788988750/Frame_38.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788869467/products/gallery/vtdniluydxpfmxv8on3a.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788869465/products/gallery/hp6dgijpdndkas0p0eif.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788819969/products/thumbnails/danrjvjxtor72zmcegt4.png',
  'https://res.cloudinary.com/h1syo9a2/image/upload/v1788708344/products/thumbnails/aufs1t6czqtu0wsjdwwx.png'
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: 'ShopCo' });

    const categories = await categoryModel.find({}).lean();
    const catMap = {};
    categories.forEach(c => {
      catMap[c.name.toLowerCase()] = c._id;
    });

    const tshirtsId = catMap['t-shirts'] || categories[0]._id;
    const shirtsId = catMap['shirts'] || categories[0]._id;
    const shortsId = catMap['shorts'] || categories[0]._id;
    const jeansId = catMap['jeans'] || categories[0]._id;
    const hatsId = catMap['hats'] || categories[0]._id;

    const productDefinitions = [
      {
        name: 'Minimalist Crewneck T-Shirt',
        description: 'Heavyweight organic cotton crewneck tee with reinforced collar and tailored relaxed fit.',
        price: 120,
        discountPrice: 96,
        discountPercentage: 20,
        category: [tshirtsId],
        variants: [
          { size: 'small', quantity: 15 },
          { size: 'medium', quantity: 25 },
          { size: 'large', quantity: 18 },
          { size: 'x-large', quantity: 8 }
        ]
      },
      {
        name: 'Vintage Washed Graphic Tee',
        description: 'Acid-washed vintage graphic t-shirt featuring distressed typography and breathable cotton jersey.',
        price: 140,
        discountPrice: 105,
        discountPercentage: 25,
        category: [tshirtsId],
        variants: [
          { size: 'small', quantity: 12 },
          { size: 'medium', quantity: 20 },
          { size: 'large', quantity: 15 }
        ]
      },
      {
        name: 'Oversized Streetwear Tee',
        description: 'Boxy oversized fit streetwear t-shirt with dropped shoulders and thick ribbed neckline.',
        price: 160,
        discountPrice: 120,
        discountPercentage: 25,
        category: [tshirtsId],
        variants: [
          { size: 'small', quantity: 10 },
          { size: 'medium', quantity: 18 },
          { size: 'large', quantity: 14 },
          { size: 'x-large', quantity: 6 }
        ]
      },
      {
        name: 'Striped Cotton Pocket Tee',
        description: 'Classic maritime nautical stripes with a front chest pocket and soft pre-shrunk cotton fabric.',
        price: 110,
        discountPrice: 88,
        discountPercentage: 20,
        category: [tshirtsId],
        variants: [
          { size: 'small', quantity: 14 },
          { size: 'medium', quantity: 22 },
          { size: 'large', quantity: 16 }
        ]
      },
      {
        name: 'Raw Edge Slub Cotton T-Shirt',
        description: 'Textured slub jersey cotton t-shirt with unfinished raw hem edges and a laid-back silhouette.',
        price: 130,
        discountPrice: 0,
        discountPercentage: 0,
        category: [tshirtsId],
        variants: [
          { size: 'small', quantity: 8 },
          { size: 'medium', quantity: 15 },
          { size: 'large', quantity: 12 }
        ]
      },
      {
        name: 'Classic Oxford Button-Down Shirt',
        description: 'Timeless Oxford weave shirt with button-down collar and mother-of-pearl buttons. Ideal for smart casual wear.',
        price: 220,
        discountPrice: 165,
        discountPercentage: 25,
        category: [shirtsId],
        variants: [
          { size: 'small', quantity: 10 },
          { size: 'medium', quantity: 16 },
          { size: 'large', quantity: 12 },
          { size: 'x-large', quantity: 5 }
        ]
      },
      {
        name: 'Relaxed Linen Camp Collar Shirt',
        description: 'Airy lightweight pure linen shirt with a retro camp collar and airy drape for warm sunny days.',
        price: 250,
        discountPrice: 200,
        discountPercentage: 20,
        category: [shirtsId],
        variants: [
          { size: 'small', quantity: 7 },
          { size: 'medium', quantity: 14 },
          { size: 'large', quantity: 10 }
        ]
      },
      {
        name: 'Plaid Heavyweight Flannel Shirt',
        description: 'Brushed cotton flannel shirt featuring twin chest flap pockets and classic heritage check pattern.',
        price: 280,
        discountPrice: 196,
        discountPercentage: 30,
        category: [shirtsId],
        variants: [
          { size: 'small', quantity: 9 },
          { size: 'medium', quantity: 15 },
          { size: 'large', quantity: 11 },
          { size: 'x-large', quantity: 4 }
        ]
      },
      {
        name: 'Band Collar Chambray Shirt',
        description: 'Modern grandad band collar shirt tailored from soft washed indigo chambray with contrast stitching.',
        price: 210,
        discountPrice: 0,
        discountPercentage: 0,
        category: [shirtsId],
        variants: [
          { size: 'small', quantity: 11 },
          { size: 'medium', quantity: 17 },
          { size: 'large', quantity: 13 }
        ]
      },
      {
        name: 'Slim Fit Poplin Dress Shirt',
        description: 'Crisp stretch poplin long-sleeve dress shirt with stiffened spread collar and French cuffs.',
        price: 240,
        discountPrice: 180,
        discountPercentage: 25,
        category: [shirtsId],
        variants: [
          { size: 'small', quantity: 8 },
          { size: 'medium', quantity: 19 },
          { size: 'large', quantity: 14 },
          { size: 'x-large', quantity: 5 }
        ]
      },
      {
        name: 'Tailored Chino Shorts',
        description: 'Smart casual knee-length chino shorts crafted from stretch cotton twill with welted back pockets.',
        price: 130,
        discountPrice: 99,
        discountPercentage: 24,
        category: [shortsId],
        variants: [
          { size: 'small', quantity: 12 },
          { size: 'medium', quantity: 20 },
          { size: 'large', quantity: 15 }
        ]
      },
      {
        name: 'Vintage Denim Cut-Off Shorts',
        description: 'Authentic five-pocket denim shorts featuring light distressing and frayed raw-edge hems.',
        price: 150,
        discountPrice: 120,
        discountPercentage: 20,
        category: [shortsId],
        variants: [
          { size: 'small', quantity: 10 },
          { size: 'medium', quantity: 18 },
          { size: 'large', quantity: 12 }
        ]
      },
      {
        name: 'Utility Cargo Shorts',
        description: 'Heavy-duty ripstop cargo shorts with multiple utility bellows pockets and an adjustable waistband.',
        price: 175,
        discountPrice: 140,
        discountPercentage: 20,
        category: [shortsId],
        variants: [
          { size: 'small', quantity: 9 },
          { size: 'medium', quantity: 16 },
          { size: 'large', quantity: 14 },
          { size: 'x-large', quantity: 6 }
        ]
      },
      {
        name: 'Athletic French Terry Shorts',
        description: 'Ultra-comfortable loopback French terry sweat shorts with drawstring waist and zip side pockets.',
        price: 110,
        discountPrice: 0,
        discountPercentage: 0,
        category: [shortsId],
        variants: [
          { size: 'small', quantity: 15 },
          { size: 'medium', quantity: 22 },
          { size: 'large', quantity: 18 }
        ]
      },
      {
        name: 'Linen Blend Drawstring Shorts',
        description: 'Breathable linen-cotton blend shorts with elasticated drawstring waist for effortless summer lounging.',
        price: 140,
        discountPrice: 112,
        discountPercentage: 20,
        category: [shortsId],
        variants: [
          { size: 'small', quantity: 11 },
          { size: 'medium', quantity: 19 },
          { size: 'large', quantity: 13 }
        ]
      },
      {
        name: 'Slim Fit Selvedge Denim Jeans',
        description: 'Premium 13oz Japanese selvedge denim jeans featuring a tapered leg and authentic contrast selvedge ID.',
        price: 350,
        discountPrice: 280,
        discountPercentage: 20,
        category: [jeansId],
        variants: [
          { size: 'small', quantity: 8 },
          { size: 'medium', quantity: 14 },
          { size: 'large', quantity: 10 },
          { size: 'x-large', quantity: 4 }
        ]
      },
      {
        name: 'Relaxed 90s Straight Leg Jeans',
        description: 'Vintage-inspired medium blue wash denim jeans with a comfortable high rise and straight leg cut.',
        price: 290,
        discountPrice: 203,
        discountPercentage: 30,
        category: [jeansId],
        variants: [
          { size: 'small', quantity: 12 },
          { size: 'medium', quantity: 20 },
          { size: 'large', quantity: 16 }
        ]
      },
      {
        name: 'Faded Black Skinny Jeans',
        description: 'Comfort-stretch denim skinny jeans in washed charcoal black with branded hardware.',
        price: 260,
        discountPrice: 0,
        discountPercentage: 0,
        category: [jeansId],
        variants: [
          { size: 'small', quantity: 10 },
          { size: 'medium', quantity: 15 },
          { size: 'large', quantity: 12 }
        ]
      },
      {
        name: 'Distressed Carpenter Denim Jeans',
        description: 'Heavy-duty workwear jeans featuring knee panel reinforcements, hammer loop, and tool pockets.',
        price: 320,
        discountPrice: 240,
        discountPercentage: 25,
        category: [jeansId],
        variants: [
          { size: 'small', quantity: 7 },
          { size: 'medium', quantity: 16 },
          { size: 'large', quantity: 11 }
        ]
      },
      {
        name: 'Loose Fit Wide Leg Denim',
        description: 'Modern wide-leg skate-style jeans crafted from durable 100% rigid cotton denim.',
        price: 300,
        discountPrice: 225,
        discountPercentage: 25,
        category: [jeansId],
        variants: [
          { size: 'small', quantity: 9 },
          { size: 'medium', quantity: 17 },
          { size: 'large', quantity: 13 },
          { size: 'x-large', quantity: 5 }
        ]
      },
      {
        name: 'Classic Structured Baseball Cap',
        description: 'Six-panel cotton twill baseball cap with curved brim, embroidered eyelets, and adjustable brass buckle.',
        price: 75,
        discountPrice: 60,
        discountPercentage: 20,
        category: [hatsId],
        variants: [
          { size: 'small', quantity: 10 },
          { size: 'medium', quantity: 25 },
          { size: 'large', quantity: 15 }
        ]
      },
      {
        name: 'Waffle Knit Wool Beanie',
        description: 'Ribbed waffle-knit merino wool blend beanie with fold-over cuff for cozy everyday warmth.',
        price: 65,
        discountPrice: 0,
        discountPercentage: 0,
        category: [hatsId],
        variants: [
          { size: 'small', quantity: 12 },
          { size: 'medium', quantity: 30 },
          { size: 'large', quantity: 18 }
        ]
      },
      {
        name: 'Washed Cotton Bucket Hat',
        description: 'Vintage washed cotton canvas bucket hat featuring sewn ventilation eyelets and unstructured crown.',
        price: 80,
        discountPrice: 64,
        discountPercentage: 20,
        category: [hatsId],
        variants: [
          { size: 'small', quantity: 8 },
          { size: 'medium', quantity: 20 },
          { size: 'large', quantity: 12 }
        ]
      },
      {
        name: 'Embroidered Corduroy Snapback',
        description: 'Retro wide-wale corduroy flat-brim cap with subtle tonal front embroidery and adjustable snapback closure.',
        price: 85,
        discountPrice: 68,
        discountPercentage: 20,
        category: [hatsId],
        variants: [
          { size: 'small', quantity: 10 },
          { size: 'medium', quantity: 22 },
          { size: 'large', quantity: 14 }
        ]
      }
    ];

    const productsToInsert = productDefinitions.map((p, i) => {
      const thumbIdx = (i * 3) % IMAGES.length;
      const g1Idx = (i * 3 + 1) % IMAGES.length;
      const g2Idx = (i * 3 + 2) % IMAGES.length;

      const thumbnailImage = IMAGES[thumbIdx];
      const galleryImages = [IMAGES[g1Idx], IMAGES[g2Idx]];

      if (thumbnailImage === galleryImages[0] || thumbnailImage === galleryImages[1] || galleryImages[0] === galleryImages[1]) {
        throw new Error(`Duplicate image in product "${p.name}"`);
      }

      return {
        ...p,
        thumbnailImage,
        galleryImages,
        status: 'active'
      };
    });

    console.log(`Preparing to insert ${productsToInsert.length} products...`);
    const result = await productModel.insertMany(productsToInsert);
    console.log(`Successfully inserted ${result.length} products!`);

    const totalCount = await productModel.countDocuments();
    console.log(`Total products in database now: ${totalCount}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
