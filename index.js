import mongoose from "mongoose";
import OpenAI from "openai";
import { bulkDb } from "./db-utills.js";
import Product from "./model.js";

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => {
    console.log("Connected to MongoDB");
    return bulkDb();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

//?se inicializa cliente de openai con un custom endpoint y api key obtenida de github (github PAT) -> https://github.com/settings/personal-access-tokens/new
const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference", // Endpoint de la API de la que vas a consumir la inferencia
  apiKey: "", // Reemplazar con tu github PAT real
});

//?vamos a realizar RAG, asi que primero recuperamos la informacion de la base de datos
let products = await Product.find({});
// luego los pasaremos al modelo de openai para que nos genere una respuesta

//!los datos de la db vinieron crudos, podemos mapearlos y darle una estructura mas amigable para el modelo de openai
//?todo esto es a modo de ejemplo, no es necesario para el funcionamiento del modelo de openai, pero si para tener una mejor idea de lo que tenemos en la base de datos y como se comportan los datos o que informacion podemos extraer de ellos
const stats = {
  totalProducts: products.length,
  categories: [...new Set(products.map((product) => product.category))],
  inStock: products.filter((product) => product.inStock).length,
  outOfStock: products.filter((product) => !product.inStock).length,
  byCategory: products.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || 0;
    acc[product.category]++;
    return acc;
  }, {}),
  priceRange: {
    min: Math.min(...products.map((product) => product.price)),
    max: Math.max(...products.map((product) => product.price)),
    avg:
      products.reduce((acc, product) => acc + product.price, 0) /
      products.length,
  },
};

//ahora creamos un resumen final del stock
//?este resumen es lo que le pasamos al modelo para tener un contexto claro y conciso, sin sobrecargar con tokens innecesarios
//?el modelo tiene un limite de tokens, por lo que es importante no saturarlo con datos innecesarios, en este caso solo pasamos los datos mas relevantes y los que nos interesan para la conversacion
const inventorySummary = products.map((p) => ({
  name: p.name,
  price: `$${p.price.toFixed(2)}`,
  category: p.category,
  available: p.inStock ? "Disponible" : "Agotado",
  description: p.description.substring(0, 100), // solo pasamos una versión corta de la descripción
}));

console.log(
  `Resumen de inventario creado con ${inventorySummary.length} productos`
);

async function getAIResponse(prompt) {
  try {
    //?construimos el mensaje para el modelo, incluyendo un system prompt detallado y el mensaje del usuario
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini", //! modelo a utilizar, en este caso gpt-4.1-mini, pero puede ser cualquier modelo de openai
      messages: [
        {
          role: "system", //! este es el rol del sistema, que le dice al modelo que es lo que tiene que hacer, es el mensaje mas importante en toda la conversacion, establece compartamientos o limitacioens al modelo para guiar su personalidad o comportamiento
          //?a traves de los system prompts o preambulos podemos condicionar el comportamiento de la ia a cualquier cosa que queramos, en este caso le decimos que es un asistente de ventas, pero podemos decirle que actue como cualquiera cosa que necesitemos, el modelo se comportara como lo que le digamos en lenguaje natural
          content: `Eres un asistente de ventas profesional para nuestra tienda 'TechStyle'.
          Debes ser amable, informativo y siempre orientado a ayudar al cliente.

          Directrices:
          - Responde de manera precisa y amigable al cliente
          - Si preguntan por un artículo agotado, sugiere alternativas similares
          - Menciona ofertas y descuentos cuando sea apropiado
          - Conoce las políticas de la tienda: garantía de 30 días y envío gratis en compras mayores a $100
          - Puedes ofrecer asistencia en cuestiones técnicas de productos electrónicos
          - Recomienda productos similares o complementarios cuando sea oportuno

Tono y Estilo:
- Profesional pero cercano
- Evita tecnicismos excesivos
- Usa frases cortas y directas
- Siempre finaliza preguntando si puedes ayudar en algo más

## Información del inventario actual (${new Date().toLocaleDateString()}):
- Total de productos: ${stats.totalProducts}
- Productos disponibles: ${stats.inStock}
- Productos agotados: ${stats.outOfStock}
- Categorías: ${Object.entries(stats.byCategory)
            .map(([cat, count]) => `${cat} (${count})`)
            .join(", ")}
- Rango de precios: $${stats.priceRange.min.toFixed(
            2
          )} - $${stats.priceRange.max.toFixed(2)}
- Precio promedio: $${stats.priceRange.avg.toFixed(2)}

Inventario Detallado:
${JSON.stringify(inventorySummary, null, 2)}


Promociones Actuales:
- 10% de descuento en todos los productos electrónicos hasta el fin de mes
- 2x1 en accesorios de moda los fines de semana
- Envío gratuito en compras superiores a $100

          `,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      //?Es un valor entre 0 y 1
      //!MIENTRAS MAS ALTA SU TEMPERATURA MAS IMPREDECIBLE/CREATIVO es el modelo, pero a la vez menos coherente y preciso, por lo que es importante encontrar un balance entre creatividad y coherencia
      max_completion_tokens: 5000, //esto es el limite de tokens que puede generar el modelo al darnos una respuesta, no superará esta longitud
    });
    return response.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}

//?EJEMPLOS DE USO: diferentes escenarios de preguntas de clientes y cómo manejarlos

// !EJEMPLO 1: Consulta básica sobre disponibilidad y precio
getAIResponse("¿Tienen laptops disponibles? ¿Cuál es la más barata?")
  .then((response) => console.log("Respuesta 1:", response))
  .catch((err) => console.error("Error:", err));

// !EJEMPLO 2: Consulta sobre un producto específico
getAIResponse("Busco una camiseta negra talla M. ¿Tienen disponible?")
  .then((response) => console.log("Respuesta 2:", response))
  .catch((err) => console.error("Error:", err));

//!EJEMPLO 3: Consulta sobre descuentos y promociones
// getAIResponse("¿Qué ofertas tienen esta semana en electrónicos?")
//   .then(response => console.log("Respuesta 3:", response))
//   .catch(err => console.error("Error:", err));

//!EJEMPLO 4: Consulta técnica
// getAIResponse("¿Qué diferencia hay entre los auriculares inalámbricos y los con cable que venden?")
//   .then(response => console.log("Respuesta 4:", response))
//   .catch(err => console.error("Error:", err));

//!EJEMPLO 5: Consulta sobre políticas de la tienda
// getAIResponse("¿Cuál es su política de devoluciones? ¿Puedo cambiar algo si no me queda bien?")
//   .then(response => console.log("Respuesta 5:", response))
//   .catch(err => console.error("Error:", err));

//!EJEMPLO 6: Producto agotado (prueba de sugerencias alternativas)
// getAIResponse("Me interesa el smartphone Ultra X9 que vi en su web. ¿Todavía lo tienen?")
//   .then(response => console.log("Respuesta 6:", response))
//   .catch(err => console.error("Error:", err));

//!EJEMPLO 7: Consulta sobre múltiples productos
// getAIResponse("Estoy buscando un outfit completo: zapatos, pantalón y camisa. ¿Qué me recomiendan que combine bien?")
//   .then(response => console.log("Respuesta 7:", response))
//   .catch(err => console.error("Error:", err));

//!EJEMPLO 8: Comparación entre productos
// getAIResponse("¿Cuál es mejor, el reloj inteligente SportTrack o el FitnessPro? ¿Qué diferencias tienen?")
//   .then(response => console.log("Respuesta 8:", response))
//   .catch(err => console.error("Error:", err));

//!EJEMPLO 9: Consulta sobre envíos
// getAIResponse("Si compro hoy, ¿cuándo llegaría mi pedido? Vivo en el centro de la ciudad.")
//   .then(response => console.log("Respuesta 9:", response))
//   .catch(err => console.error("Error:", err));

//!EJEMPLO 10: Consulta con múltiples preguntas
// getAIResponse("Hola, quiero comprar un regalo para mi hermana que le gusta hacer ejercicio. Tengo un presupuesto de $50. ¿Qué me recomiendan? ¿Tienen envoltorio de regalo?")
//   .then(response => console.log("Respuesta 10:", response))
//   .catch(err => console.error("Error:", err));

//! ESTE EJEMPLO NO CONTEMPLA CONVERSACIONES MULTITURNO NI PERSISTENCIA DE LOS MENSAJES. se verá en un ejemplo proximo
