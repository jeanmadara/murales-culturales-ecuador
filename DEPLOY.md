# Desplegar en GitHub Pages

## Pasos para Publicar

### 1. Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** (repositorio nuevo)
3. Nombre sugerido: `murales-culturales-ecuador`
4. Marca como **público**
5. **NO** inicialices con README (ya tienes uno)
6. Crea el repositorio

### 2. Subir el Proyecto

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Primer commit: Sitio de murales culturales"

# Conectar con tu repositorio de GitHub
# Reemplaza TU_USUARIO con tu nombre de usuario
git remote add origin https://github.com/TU_USUARIO/murales-culturales-ecuador.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

### 3. Activar GitHub Pages

1. En tu repositorio de GitHub, ve a **Settings** (Configuración)
2. En el menú lateral, busca **Pages**
3. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
4. Haz clic en **Save**
5. Espera 1-2 minutos

### 4. Acceder al Sitio

Tu sitio estará disponible en:
```
https://TU_USUARIO.github.io/murales-culturales-ecuador/
```

## 🎯 Generar Códigos QR

Una vez publicado, puedes crear QR para cada mural:

- **Mural 1**: `https://TU_USUARIO.github.io/murales-culturales-ecuador/murales/mural1.html`
- **Mural 2**: `https://TU_USUARIO.github.io/murales-culturales-ecuador/murales/mural2.html`
- Y así sucesivamente...

Usa herramientas como [QR Code Generator](https://www.qr-code-generator.com/) para crearlos.

## 📝 Actualizar el Sitio

Cuando hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Los cambios se reflejarán automáticamente en 1-2 minutos.

## ⚠️ Nota Importante

GitHub Pages funciona como un servidor web, por lo que **todos los archivos JSON se cargarán correctamente** sin necesidad de configuración adicional.
