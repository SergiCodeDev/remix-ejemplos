const remixRoutesExplanation = `
# Sistema de Rutas en Remix

Remix utiliza un sistema de enrutamiento basado en archivos, lo que significa que la estructura de archivos y carpetas en tu proyecto define las rutas de tu aplicación. Aquí te explico los conceptos clave:

---

## 1. Rutas básicas

Cualquier archivo dentro de la carpeta \`app/routes\` se convierte en una ruta en tu aplicación. El nombre del archivo se mapea directamente a la URL.

- **Ejemplo**:
  \`\`\`
  app/
  ├── routes/
  │   ├── _index.tsx       -> Ruta principal (\`/\`)
  │   ├── about.tsx        -> Ruta \`/about\`
  │   └── contact.tsx      -> Ruta \`/contact\`
  └── root.tsx
  \`\`\`

  - \`_index.tsx\` es la ruta principal (\`/\`).
  - \`about.tsx\` corresponde a la ruta \`/about\`.
  - \`contact.tsx\` corresponde a la ruta \`/contact\`.

---

## 2. Segmentos dinámicos

Si necesitas rutas que dependen de datos dinámicos (como un ID o un nombre), puedes usar segmentos dinámicos. Estos se definen con un prefijo \`$\`.

- **Ejemplo**:
  \`\`\`
  app/
  ├── routes/
  │   ├── users.$userId.tsx  -> Ruta \`/users/:userId\`
  └── root.tsx
  \`\`\`

  - Si visitas \`/users/123\`, \`params.userId\` será \`"123"\`.
  - Puedes acceder a este valor en el \`loader\` o \`action\` de la ruta.

---

## 3. Rutas anidadas

Las rutas anidadas permiten crear jerarquías en la URL y en la interfaz de usuario. Se crean usando puntos (\`.\`) en los nombres de los archivos.

- **Ejemplo**:
  \`\`\`
  app/
  ├── routes/
  │   ├── blog._index.tsx    -> Ruta \`/blog\`
  │   ├── blog.$postId.tsx   -> Ruta \`/blog/:postId\`
  │   └── blog.tsx           -> Layout principal para \`/blog\`
  └── root.tsx
  \`\`\`

  - \`blog.tsx\` es el layout principal para las rutas de \`/blog\`.
  - \`blog._index.tsx\` es la ruta principal de \`/blog\`.
  - \`blog.$postId.tsx\` es una ruta dinámica para \`/blog/:postId\`.

  La interfaz de usuario se renderiza de manera anidada:
  \`\`\`tsx
  <Root>
    <Blog>
      <Post />
    </Blog>
  </Root>
  \`\`\`

---

## 4. Rutas sin anidamiento de layout

Si quieres que una ruta tenga una URL anidada pero no herede el layout de su "padre", puedes usar un guion bajo (\`_\`) al final del nombre del archivo.

- **Ejemplo**:
  \`\`\`
  app/
  ├── routes/
  │   ├── concerts.tsx       -> Layout principal para \`/concerts\`
  │   ├── concerts_.mine.tsx -> Ruta \`/concerts/mine\` (sin anidamiento)
  └── root.tsx
  \`\`\`

  - \`/concerts/mine\` no heredará el layout de \`concerts.tsx\`.

---

## 5. Rutas sin segmentos en la URL

Si quieres compartir un layout entre varias rutas sin que esto afecte la URL, puedes usar un guion bajo (\`_\`) al principio del nombre del archivo.

- **Ejemplo**:
  \`\`\`
  app/
  ├── routes/
  │   ├── _auth.login.tsx    -> Ruta \`/login\`
  │   ├── _auth.register.tsx -> Ruta \`/register\`
  │   └── _auth.tsx          -> Layout compartido para \`/login\` y \`/register\`
  └── root.tsx
  \`\`\`

  - \`/login\` y \`/register\` compartirán el layout de \`_auth.tsx\`, pero la URL no incluirá \`auth\`.

---

## 6. Segmentos opcionales

Puedes hacer que un segmento de la ruta sea opcional envolviéndolo en paréntesis.

- **Ejemplo**:
  \`\`\`
  app/
  ├── routes/
  │   ├── ($lang)._index.tsx -> Ruta \`/\` o \`/:lang\`
  │   └── ($lang).about.tsx  -> Ruta \`/about\` o \`/:lang/about\`
  └── root.tsx
  \`\`\`

  - \`/about\` y \`/es/about\` mapearán a la misma ruta.

---

## 7. Rutas comodín (Splat Routes)

Las rutas comodín (\`$.tsx\`) capturan todo lo que sigue en la URL. Son útiles para manejar rutas desconocidas o para crear rutas dinámicas complejas.

- **Ejemplo**:
  \`\`\`
  app/
  ├── routes/
  │   ├── $.tsx              -> Captura cualquier ruta no definida
  └── root.tsx
  \`\`\`

  - Si visitas \`/algo/inexistente\`, esta ruta capturará la URL y podrás acceder a \`params["*"]\` para obtener el valor.

---

## 8. Escapar caracteres especiales

Si necesitas usar caracteres especiales (como \`.\` o \`$\`) en la URL, puedes escaparlos usando corchetes (\`[]\`).

- **Ejemplo**:
  \`\`\`
  app/
  ├── routes/
  │   ├── sitemap[.]xml.tsx  -> Ruta \`/sitemap.xml\`
  └── root.tsx
  \`\`\`

---

## 9. Organización con carpetas

Puedes organizar tus rutas en carpetas para mantener tu código más limpio. La ruta se define por el nombre de la carpeta, y el archivo principal debe llamarse \`route.tsx\`.

- **Ejemplo**:
  \`\`\`
  app/
  ├── routes/
  │   ├── blog/
  │   │   ├── route.tsx      -> Ruta \`/blog\`
  │   │   └── post-card.tsx  -> Componente interno
  └── root.tsx
  \`\`\`

---

## 10. Escalabilidad

Para aplicaciones grandes, se recomienda:
- Convertir cada ruta en una carpeta.
- Colocar los módulos específicos de la ruta dentro de su carpeta.
- Colocar los módulos compartidos fuera de la carpeta \`routes\`.

---

## Resumen

El sistema de rutas de Remix es muy flexible y potente. Te permite:
- Crear rutas básicas y dinámicas.
- Anidar rutas y layouts.
- Usar segmentos opcionales y rutas comodín.
- Organizar tu código de manera escalable.

Si prefieres un enfoque diferente al sistema de archivos plano, Remix también te permite configurar rutas manualmente o usar paquetes de la comunidad como \`remix-flat-routes\` o \`remix-json-routes\`.
`
