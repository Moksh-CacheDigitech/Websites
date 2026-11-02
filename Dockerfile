# Cache Digitech static site - multi-stage Docker build
# Container listens on port 80.
# Default compose mapping: host 8080 -> container 80
# (host 3000 often conflicts with other local apps)

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
COPY frontend/package.json frontend/package-lock.json ./frontend/

RUN npm install --prefix frontend --include=dev

COPY frontend ./frontend
COPY package.json ./

RUN npm run build --prefix frontend

# ---- serve ----
FROM nginx:1.27-alpine AS runtime

# Remove default site; use our SPA config
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/release /usr/share/nginx/html

# nginx listens on 80 inside the container
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
