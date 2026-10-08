# Watchlog Mobile

App React Native con Expo para Android e iOS.

## Ejecutar

Desde esta carpeta:

```bash
npm install
npm start
```

Después abrí Expo Go y escaneá el QR, o ejecutá `npm run android` / `npm run ios`.

## API

Para desarrollo local, la app usa `http://localhost:4000`. En un dispositivo físico, `localhost` apunta al teléfono; configurá la URL de tu API:

```env
EXPO_PUBLIC_API_URL=https://TU-SERVICIO.onrender.com
```

También puede pasarse al iniciar Expo:

```powershell
$env:EXPO_PUBLIC_API_URL="https://TU-SERVICIO.onrender.com"; npm start
```

La sesión se guarda con SecureStore y las listas se leen y escriben mediante la API remota. El menú hamburguesa contiene películas, vistas, pendientes, mirando, videojuegos, libros, leídos, pendientes y leyendo.
