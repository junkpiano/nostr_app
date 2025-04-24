# Use official Nginx image
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom HTML into the container
COPY index.html /usr/share/nginx/html/

# Expose the port
EXPOSE 80