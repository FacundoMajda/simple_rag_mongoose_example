import Product from "./model.js";

export const bulkDb = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      return;
    }

    const sampleProducts = [
      // Electronics - Computers & Laptops (2 products)
      {
        name: "MacBook Pro 16 pulgadas",
        description:
          "Último MacBook Pro con chip M2 Pro, 16GB RAM, 512GB SSD. Ideal para profesionales creativos y desarrolladores.",
        price: 2499.99,
        category: "Electronics",
        inStock: true,
      },
      {
        name: "Dell XPS 15",
        description:
          "Potente laptop con pantalla InfinityEdge 4K, NVIDIA GeForce RTX, 32GB RAM y procesador Intel de 12ª generación.",
        price: 1899.99,
        category: "Electronics",
        inStock: false,
      },

      // Electronics - TVs & Home Entertainment (1 product)
      {
        name: "LG OLED C2 55 pulgadas",
        description:
          "Televisor OLED con tecnología de autoiluminación de píxeles, HDMI 2.1 y procesador α9 Gen5 AI para gaming y cine.",
        price: 1699.99,
        category: "Electronics",
        inStock: true,
      },

      // Electronics - Audio & Wearables (2 products)
      {
        name: "Auriculares inalámbricos con cancelación de ruido",
        description:
          "Auriculares con cancelación activa de ruido y 30 horas de batería. Perfectos para viajes y entornos ruidosos.",
        price: 249.99,
        category: "Electronics",
        inStock: true,
      },
      {
        name: "Smartwatch Samsung Galaxy Watch 5",
        description:
          "Reloj inteligente con seguimiento avanzado de salud, ECG, sensor de presión arterial y batería de larga duración.",
        price: 289.99,
        category: "Electronics",
        inStock: false,
      },

      // Clothing - Tops & Shirts (1 product)
      {
        name: "Camisa Oxford de manga larga",
        description:
          "Camisa formal de algodón premium con botones y cuello clásico. Ideal para entornos profesionales.",
        price: 59.99,
        category: "Clothing",
        inStock: true,
      },

      // Clothing - Outerwear (2 products, both in stock)
      {
        name: "Chaqueta de invierno tipo parka",
        description:
          "Chaqueta impermeable y aislante perfecta para el clima frío de invierno. Con capucha desmontable.",
        price: 149.99,
        category: "Clothing",
        inStock: true,
      },
      {
        name: "Cazadora de cuero sintético",
        description:
          "Chaqueta estilo motero en cuero vegano de alta calidad con detalles metálicos y forro de poliéster suave.",
        price: 89.99,
        category: "Clothing",
        inStock: true,
      },

      // Clothing - Pants & Bottoms (1 product, out of stock)
      {
        name: "Pantalones chinos de algodón",
        description:
          "Pantalones casuales con corte recto, bolsillos laterales y tejido de algodón resistente y cómodo.",
        price: 49.99,
        category: "Clothing",
        inStock: false,
      },

      // Home Appliances - Kitchen (2 products)
      {
        name: "Cafetera inteligente",
        description:
          "Cafetera programable con control por smartphone y funciones de preparación automática. Control de temperatura preciso.",
        price: 129.99,
        category: "Home Appliances",
        inStock: true,
      },
      {
        name: "Procesador de alimentos 3 en 1",
        description:
          "Procesador versátil con múltiples accesorios, motor de 1000W y recipiente de acero inoxidable de gran capacidad.",
        price: 149.99,
        category: "Home Appliances",
        inStock: true,
      },

      // Home Appliances - Cleaning (1 product)
      {
        name: "Robot aspirador",
        description:
          "Robot aspirador inteligente con tecnología de mapeo y depósito autovaciable. Programable por app.",
        price: 399.99,
        category: "Home Appliances",
        inStock: false,
      },

      // Books - Technical & Professional (2 products)
      {
        name: "El arte del diseño de software",
        description:
          "Guía completa de arquitectura de software moderna y patrones de diseño. Escrito por expertos de la industria.",
        price: 34.99,
        category: "Books",
        inStock: true,
      },
      {
        name: "Python para análisis de datos",
        description:
          "Guía práctica para manipulación de datos, visualización y análisis estadístico con bibliotecas populares de Python.",
        price: 39.99,
        category: "Books",
        inStock: false,
      },

      // Books - Fiction & Literature (1 product)
      {
        name: "Horizontes perdidos: Trilogía completa",
        description:
          "Box set de la aclamada trilogía de ciencia ficción que reimagina el futuro de la humanidad en las estrellas.",
        price: 49.99,
        category: "Books",
        inStock: false,
      },

      // Other - Fitness & Sports (1 product)
      {
        name: "Set de pesas ajustables",
        description:
          "Conjunto de mancuernas con peso ajustable de 2.5kg a 25kg cada una. Ideal para entrenamiento en casa.",
        price: 189.99,
        category: "Other",
        inStock: true,
      },

      // Other - Home Decor (2 products)
      {
        name: "Lámpara de pie moderna",
        description:
          "Lámpara minimalista con brazo ajustable, luz LED regulable y base estable de mármol. Perfecta para salas de estar.",
        price: 129.99,
        category: "Other",
        inStock: true,
      },
      {
        name: "Espejo de pared decorativo",
        description:
          "Espejo con marco de metal dorado y diseño hexagonal. Elegante complemento para cualquier habitación.",
        price: 89.99,
        category: "Other",
        inStock: false,
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log(
      `¡Base de datos poblada con éxito! Se insertaron ${sampleProducts.length} productos.`
    );
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
  }
};
