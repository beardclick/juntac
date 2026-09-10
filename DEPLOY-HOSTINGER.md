# Despliegue en Hostinger con GitHub y Supabase

Esta aplicación necesita hosting para Node.js; no debe publicarse como un sitio HTML estático. En Hostinger utiliza un plan **Business Web Hosting** o **Cloud** con soporte para aplicaciones Node.js.

## 1. Preparar Supabase

1. Crea un proyecto en Supabase.
2. Abre **SQL Editor**, pega el contenido de `supabase/schema.sql` y ejecútalo una sola vez. El script crea las tablas, datos iniciales y políticas RLS.
3. Abre **Storage**, crea un bucket llamado exactamente `media` y configúralo como público. La aplicación guarda allí las imágenes subidas desde el administrador.
4. En **Authentication > Users**, crea el usuario administrador con correo y contraseña.
5. En **Authentication > URL Configuration** configura:
   - **Site URL:** `https://tu-dominio.com`
   - **Redirect URLs:** `https://tu-dominio.com/**`
   - Mientras desarrollas puedes conservar también `http://localhost:3000/**`.
6. En **Project Settings > API** copia:
   - Project URL
   - Anon/public key
   - Service role key

La `service_role` es secreta: nunca debe subirse a GitHub ni exponerse en variables que empiecen con `NEXT_PUBLIC_`.

## 2. Subir el proyecto a GitHub

Desde la carpeta raíz del proyecto:

```bash
git init
git add .
git commit -m "Preparar sitio para producción"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Antes de hacer `git add`, comprueba que `.env.local`, `.next` y `node_modules` no aparezcan en los cambios. Ya están excluidos por `.gitignore`.

## 3. Crear la aplicación en Hostinger

1. En hPanel entra en **Websites > Add Website**.
2. Selecciona **Deploy Web App / Node.js Web App**.
3. Elige **Import Git Repository** y autoriza GitHub.
4. Selecciona el repositorio y la rama `main`.
5. Usa estos ajustes:
   - Framework: **Next.js**
   - Node.js: **20.x**
   - Root directory: `/` o vacío
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Output directory, si la solicita: `.next`
6. No subas `node_modules` ni `.next`; Hostinger los genera durante cada despliegue.

## 4. Variables de entorno en Hostinger

Agrega estas variables en el paso **Environment Variables** o en el dashboard de la aplicación:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
NODE_ENV=production
```

Para enviar reportes por correo agrega también:

```dotenv
SMTP_HOST=servidor-smtp
SMTP_PORT=587
SMTP_USER=correo@tu-dominio.com
SMTP_PASS=contraseña-o-app-password
REPORT_RECIPIENT=correo-que-recibe-los-reportes@tu-dominio.com
```

No necesitas `ADMIN_EMAIL` ni `ADMIN_PASSWORD` cuando autenticas al administrador mediante Supabase Auth. No copies `.env.local` al repositorio.

## 5. Dominio y comprobaciones

1. Cuando el primer despliegue termine, conecta el dominio desde el dashboard de la aplicación.
2. Activa SSL y fuerza HTTPS.
3. Vuelve a Supabase y verifica que la URL final coincida con **Site URL** y **Redirect URLs**.
4. Prueba:
   - página principal;
   - inicio de sesión en `/admin/login`;
   - crear una noticia;
   - subir una imagen y confirmar que su URL pertenece a Supabase Storage;
   - enviar un reporte y confirmar el correo.
5. Revisa **Deployments > Logs** si una construcción o ejecución falla.

## 6. Actualizaciones posteriores

Cada cambio enviado a la rama conectada dispara un nuevo despliegue automático:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Si cambias una variable de entorno en Hostinger, aplica los cambios y vuelve a desplegar para garantizar que Next.js la incorpore durante la compilación.

## Problemas frecuentes

- **Cannot find module `./787.js`:** detén el servidor local, elimina únicamente `.next` y ejecuta de nuevo `npm run dev`. Nunca subas `.next` a GitHub.
- **Error durante el build:** confirma Node 20.x, `package.json` en la raíz y todas las variables requeridas.
- **Las imágenes no se guardan:** confirma que existe el bucket público `media` y que `SUPABASE_SERVICE_ROLE_KEY` está configurada solo en Hostinger.
- **El administrador no inicia sesión:** confirma que el usuario existe en Supabase Auth y revisa las URL permitidas.
- **Los datos públicos no aparecen:** ejecuta `supabase/schema.sql` y revisa RLS en Supabase Security Advisor.
