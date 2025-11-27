# Murales Culturales del Litoral Ecuatoriano

Sitio web que presenta 7 murales representativos de las culturas precolombinas de la costa ecuatoriana.

##  Culturas Representadas

1. **Valdivia** - Las Venus de cerámica
2. **Chorrera** - Botellas silbato
3. **Jama-Coaque** - Danzantes ceremoniales
4. **Bahía** - Navegantes del Pacífico
5. **Guangala** - Geometría policromada
6. **Manteña** - Sillas de poder
7. **La Tolita** - Orfebrería en oro

## 📁 Estructura del Proyecto

```
├── index.html              # Página principal
├── murales/                # Páginas individuales de murales
│   ├── mural1.html
│   ├── mural2.html
│   └── ...
├── assets/
│   ├── css/style.css       # Estilos responsive
│   ├── js/
│   │   ├── app.js          # Lógica del index
│   │   ├── mural.js        # Lógica de páginas de mural
│   │   └── layout.js       # Header, footer y head dinámicos
│   └── img/                # Imágenes de murales
└── data/
    ├── murales.json        # Datos de los murales
    └── culturas.json       # Información de culturas
```

## 🚀 Cómo Usar

### Opción 1: Servidor Local (Recomendado)

Para que los datos JSON se carguen correctamente:

```bash
# Con Python 3
python -m http.server

# Luego abre: http://localhost:8000
```

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsive mobile-first
- **JavaScript Vanilla** - Sin frameworks ni dependencias
- **JSON** - Almacenamiento de contenido

## ✨ Características

- ✅ 100% estático (sin backend)
- ✅ Responsive (móvil, tablet, desktop)
- ✅ Carga dinámica de contenido desde JSON
- ✅ Layout compartido sin redundancia de código
- ✅ Compatible con códigos QR para acceso directo

## 📝 Editar Contenido

Para modificar la información de los murales o culturas, edita los archivos JSON en la carpeta `data/`:

- `murales.json` - Títulos, descripciones, imágenes, videos
- `culturas.json` - Información de cada cultura

## 📄 Licencia

CC Attribution ShareAlike
